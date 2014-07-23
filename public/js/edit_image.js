var has_item_id = typeof item_id != "undefined", img_url_upload = false;
$(function () {
    'use strict';
    // Change this to the location of your server-side upload handler:
    has_item_id = typeof item_id != "undefined";
    var item_str = "img";
    if(has_item_id) item_str = item_id + "/img";
    var url = domain + "/items/" + item_str,
        uploadButton = $('<button/>')
            .addClass('btn btn-success centered')
            .prop('disabled', true)
            .text('Processing...')
            .on('click', function () {
                var $this = $(this),
                    data = $this.data();
                $this
                    .off('click')
                    .text('Abort')
                    .on('click', function () {
                        $this.remove();
                        data.abort();
                    });
                data.submit().always(function () {
                    $this.remove();
                });
            });
    $('#fileupload').fileupload({
        url: url,
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
        maxFileSize: 100000000, // 100 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth: 200,
        previewMaxHeight: 200,
        imageMaxWidth: 200,
        imageMaxHeight: 200,
        imageMinWidth: 200,
        imageMinHeight: 200,
        previewCrop: false
    }).on('fileuploadadd', function (e, data) {
        data.context = $('<div/>').appendTo('#files');
        $.each(data.files, function (index, file) {
            var node = $('<p/>')
                    .append($('<span/>').text(file.name));
            if (!index) {
                node
                    .append('<br>')
                    .append(uploadButton.clone(true).data(data));
            }
            node.appendTo(data.context);
        });
    }).on('fileuploadprocessalways', function (e, data) {
        var index = data.index,
            file = data.files[index],
            node = $(data.context.children()[index]);
        if (file.preview) {
            node
                .prepend('<br>')
                .prepend(file.preview);
        }
        if (file.error) {
            node
                .append('<br>')
                .append($('<span class="text-danger"/>').text(file.error));
        }
        if (index + 1 === data.files.length) {
            data.context.find('button')
                .text('Upload')
                .prop('disabled', !!data.files.error);
        }
    }).on('fileuploadprogressall', function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress .progress-bar').css(
            'width',
            progress + '%'
        );
    }).on('fileuploaddone', function (e, data) {
        img_update_success(data.result);
    }).on('fileuploadfail', function (e, data) {
        $.each(data.files, function (index, file) {
            var error = $('<span class="text-danger"/>').text('File upload failed.');
            $(data.context.children()[index])
                .append('<br>')
                .append(error);
        });
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});

$("a[img_url]").click(function(e) {
  e.preventDefault();
  var img_url = $(this).attr("img_url");
  var time = $(this).html();
  // Update the pointer dropdown
  $("#primary_img_datetime_span").html(time);
  // Update the image
  $("#cur_img").attr("src",img_url);
});

$("#apply_edit_image").click(function(e) {
  e.preventDefault();

  $.post("/item/" + item_id + "/img", {
    time: $("#primary_img_datetime_span").html()
  }, img_update_success, 'json');
});

$("#set_image_url").submit(function(e) {
  e.preventDefault();
  img_url_upload = true;
  var fileUrlPtr = $("#fileurl");
  fileUrlPtr.attr('disabled','disabled');
  $.get("/item/img/url", {
    url: fileUrlPtr.val()
  }, function(data) {
    try {
      var fileUrlPtr = $("#fileurl");
      fileUrlPtr.removeAttr('disabled');
      var url = fileUrlPtr.val();
      if(typeof data != "string" || data.match(/^\{\"fail/)) {
        var jsonFailure = JSON.parse(data);
        $.growl(jsonFailure.fail,growl_resp.fail);
        return;
      }
      
      if(url.match(/(\.|\/)(gif|jpe?g|png|bmp)$/i) == null) {
        $.growl("Image url invalid",growl_resp.fail);
        return;
      }
      var contentType = "image/png";
      if(url.match(/(\.|\/)(gif)$/i)) {
        contentType = "image/gif";
      } else if(url.match(/(\.|\/)(jpe?g)$/i)) {
        contentType = "image/jpeg";
      } else if(url.match(/(\.|\/)(bmp)$/i)) {
        contentType = "image/bmp";
      }

      var byteCharacters = atob(data);
      var byteNumbers = new Array(byteCharacters.length);
      for(var i = 0; i < byteCharacters.length; i++)
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], {type: contentType});
      blob.name = url.match(/[^\/]+$/)[0];
    
      has_item_id = typeof item_id != "undefined";
      var item_str = "img";
      if(has_item_id) item_str = item_id + "/img";
      var url = domain + "/items/" + item_str;
      $("#fileupload").fileupload('send',{
        files:[blob],
        url: url,
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
        maxFileSize: 100000000, // 100 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth: 200,
        previewMaxHeight: 200,
        imageMaxWidth: 200,
        imageMaxHeight: 200,
        imageMinWidth: 200,
        imageMinHeight: 200,
        previewCrop: false
      }).error(function(){
        img_url_upload = false;
        $.growl("Item image update failed",growl_resp.fail);
      });
    } catch(e2) {
      img_url_upload = false;
      $.growl("Could not parse image", growl_resp.fail);
    }
  });
});

function img_update_success(data) {
  if(data.success) {
    $.growl("Item image updated",growl_resp.pass);
    if(has_item_id) {
      window.location.reload(true);
    } else {
      // If data.result.rename is true, then this will be passed forward to the create as img_url_hash. Otherwise it is img_url.
      if(data.result.rename)
        add_item_row.attr("img_url_hash",data.result.file_name);
      else
        add_item_row.attr("img_url",data.result.file_name);
      $(add_item_row.children()[2]).children().attr("onclick","cleanEditImageModal(\""+ data.result.file_name +"\")");
      // Hide the modal   
      if(!img_url_upload)
        $("#edit_image_modal").modal('hide');
      cleanEditImageModal(data.result.file_name);
    }
  } else {
    $.growl(data.message,growl_resp.fail);
  }
  img_url_upload = false;
}
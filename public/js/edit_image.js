$(function () {
    'use strict';
    // Change this to the location of your server-side upload handler:
    var url = domain + "/items/" + item_id + "/img",
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
        maxFileSize: 5000000, // 5 MB
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

function img_update_success(data) {
  if(data.success) {
    $.growl("Item image updated",growl_resp.pass);
    window.location.reload(true);
  } else {
    $.growl(data.message,growl_resp.fail);
  }
}
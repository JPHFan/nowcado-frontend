$("pre > div.btn-group > div").tooltip("hide");
var edited_review_last_html;

$(document).ready(function() {attach_form_handlers();add_review_handler();});

function add_review_handler() {
  $("#add_review button").click(function(e) {
    e.preventDefault();
    var add_review_div = $(this).parent();
    $.post(add_review_div.attr("href"),function(data) {
      edited_review_last_html = "";
      $("#no_reviews").after(data);
      add_review_div.hide();
      review_submit_handler("create");
    });
  });
}

function review_submit_handler(action) {
  set_stars();
  $("pre > div.btn-group > div").tooltip("hide");
  $("button[review-id]").click(function(e) {
    e.preventDefault();
    var form = $(this).parent();
    var rating = form.children("label").children("div.star.read-write").children("input").val();
    var review = encodeURI(form.children("textarea").val());
    $.post("/" + action + "/" + $(this).attr("type") + "/" + $("#reviews_parent_id").attr("parent-id") + "/" + $(this).attr("review-id") + "?rating=" + rating + "&review=" + review, function(data) {
      if(data["success"] == false) {
        form.children("div.alert").html(concat_err_string(data["message"],null)).show();
      } else {
        $("#no_reviews").hide();
        form.replaceWith(data["result"]);
        set_stars();
        $("pre > div.btn-group > div").tooltip("hide");
      }
    }, 'json');
  });

  $("button[cancel-id]").click(function(e) {
    e.preventDefault();
    if (edited_review_last_html == ""){
      $(this).parent().remove();
      $("#add_review").show();
    }
    else{
      $(this).parent().replaceWith(edited_review_last_html);
      $("pre > div.btn-group > div").tooltip("hide");
    }
  });
}

function handle_review_btn_click(href, type) {
  var icon = $("div[href='"+href+"']");
  var review_div = icon.parent().parent();
  var rating = review_div.children("label").children("div.star").attr("data-rating");
  var review = review_div.children("div.well").html();
  var link = icon.attr("href");
  if (link.indexOf("?") >= 0){
    link += "&";
  }
  else {
    link += "?";
  }
  // For feedback buttons, toggle the UI now, instead of waiting for a backend response.
  if(icon.attr("group") != "user"){
    icon.toggleClass("active");
    if(type == "helpful") {
      // remove the unhelpful selection too.
      icon.parent().children("div[type='unhelpful']").removeClass("active");
    }
    if(type == "unhelpful") {
      // remove the helpful selection too.
      icon.parent().children("div[type='helpful']").removeClass("active");
    }
  }
  $.post(link + "rating=" + rating + "&review=" + review,function(data) {
    if(icon.attr("group") == "user") {
      if(type == "remove") {
        icon.parent().parent().remove();
        $("#add_review").show();
        if ($("pre").length <= 0){
          $("#no_reviews").show();
        }
      } else { // type == "edit" => Show the editing div.
        $("pre > div.btn-group > div").tooltip("hide");
        edited_review_last_html = icon.parent().parent()[0].outerHTML;
        icon.parent().parent().replaceWith(data);
        review_submit_handler("update");
      }
    }
  });
}

function attach_form_handlers() {
  set_stars();
  $("pre > div.btn-group > div").tooltip("hide");
  $("#reviews_div").on("click", "pre > div.btn-group > div", function(e){
    e.preventDefault();
    var icon = $(this);
    var href = icon.attr("href");
    var type = icon.attr("type");
    if(type == "remove") {
      modalConfirm("Delete Review", "Are you sure you want to delete this review?", "handle_review_btn_click('"+href+"', '"+type+"')");
    }
    else {
      handle_review_btn_click(href, type);
    }

  });
}

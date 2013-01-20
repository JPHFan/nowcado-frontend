$("pre > div.btn-group > div").tooltip("hide");
$(document).ready(function() {attach_form_handlers();});
$("#add_review button").click(function(e) {
  e.preventDefault();
  var review_div = $(this).parent();
  $.post(review_div.attr("href"),function(data) {
    review_div.html(data);
    review_submit_handler("create");
  });
});

function review_submit_handler(action) {
  set_stars();
  $("button[review-id]").click(function(e) {
    e.preventDefault();
    var form = $(this).parent();
    var rating = form.children("label").children("div.star.read-write").children("input").val();
    var review = form.children("textarea").val();
    $.post("/" + action + "/" + $(this).attr("type") + "/" + $(this).attr("review-id") + "?rating=" + rating + "&review=" + review, function(data) {
      data = JSON.parse(data);
      if(data["success"] == false) {
        var i = 0;
        var err = "";
        $.each(data["message"], function(index,val) {
            if(i > 0) {
              err += " and ";
            }
            err += index + " " + val;
            i++;
        });
        form.attr("data-original-title",err);
        form.tooltip("show");
      } else {
        form.replaceWith(data["result"]);
        attach_form_handlers();
      }
    });
  });
}

function attach_form_handlers() {
  set_stars();
  $("pre > div.btn-group > div").click(function(e){
    e.preventDefault();
    var icon = $(this);
    var type = icon.attr("type");
    var review_div = icon.parent().parent();
    var rating = review_div.children("label").children("div.star").attr("data-rating");
    var review = review_div.children("div.well").html();
    if(type == "remove") {
      if(!confirm("Are you sure you want to delete this review?")) {
        return;
      }
    }
    $.post(icon.attr("href") + "?rating=" + rating + "&review=" + review,function(data) {
      if(icon.attr("group") == "user") {
        if(type == "remove") {
          icon.parent().parent().toggle();
        } else {
          icon.parent().parent().html(data);
          review_submit_handler("update");
        }
      }
      else {
        icon.toggleClass("active");
        if(type == "helpful") {
          icon.next().removeClass("active");
        }
        if(type == "unhelpful") {
          icon.prev().removeClass("active");
        }
      }
    });
  });
}
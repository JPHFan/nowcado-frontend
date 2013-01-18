$("pre > div.btn-group > div").click(function(){
  var icon = $(this);
  var type = icon.attr("type");
  var review_div = icon.parent().parent();
  var rating = review_div.children("label").children("div.star").attr("data-rating");
  var review = review_div.children("div.well").html();
  $.post(icon.attr("href") + "?rating=" + rating + "&review=" + review,function(data) {
    if(icon.attr("group") == "user") {
      if(type == "remove") {
        icon.parent().parent().toggle();
      } else {
        icon.parent().parent().html(data);
        set_stars();
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

$("pre > div.btn-group > div").tooltip("hide");

$("button[review-id]").click(function(e) {

})
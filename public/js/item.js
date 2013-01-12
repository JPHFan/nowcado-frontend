$("#item_results button").click(function(e) {
  var loc = window.location.href;
  var id = $(this).attr("btnid");
  if (loc.charAt(loc.length-1) != "/") {
    loc += "/";
  }
  var item_ids = $("#item_ids").val().split("/");
  item_ids.splice(item_ids.indexOf(id),1);

  $.post("/set_item/" + item_ids.join("/"), function(){
    window.location = loc.replace("/" + id + "/","/");
  });
});

window.history.replaceState("","",$("#query_string").val());
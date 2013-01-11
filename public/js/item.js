$("#item_results button").click(function(e) {
  var loc = window.location.href;
  if (loc.charAt(loc.length-1) != "/") {
    loc += "/";
  }
  window.location = loc.replace("/" + $(this).attr("btnid") + "/","/");
});
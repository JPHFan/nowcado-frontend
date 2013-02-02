$("div.pagination a, div.sidebar-nav.well a, div.sidebar-nav.well input:radio, li.dropdown ul a").click(function(e) {
  e.preventDefault();
  if($(this).attr("value") == "min_rating" && $(this).attr("id") == 0) {
    remove_query_string("min_rating");
  } else {
    append_query_string($(this).attr("value"),$(this).attr("id"));
  }
  load_query_page();
});

$("#filter_reset").click(function(e) {
  e.preventDefault();
  var qs = window.location.search.substring(1).split('&');
  for(i=0;i<qs.length;i++) {
    var key = qs[i].substring(0,qs[i].indexOf("="));
    if(key != "search" && key != "latitude" && key != "longitude") {
      remove_query_string(key);
    }
  }
  load_query_page();
});

$("div.sidebar-nav.well input:checkbox").click(function(e) {
  var set_filter = false;
  if($(this).prop("checked")) {
    set_filter = true;
  }
  switch($(this).attr("id")) {
    case "open_now":
      append_query_string("open_now",set_filter);
      break;
    case "in_stock":
      append_query_string("in_stock",set_filter);
      break;
    default:
      append_query_string("department_"+encodeURIComponent($(this).attr("id")),set_filter);
  }
  load_query_page();
});

$("#price_filter").click(function(e) {
  e.preventDefault();
  var min_price = $("#min_price").val();
  var max_price = $("#max_price").val();
  if(min_price != "") {
    append_query_string("min_price",min_price);
  }
  if(max_price != "") {
    append_query_string("max_price",max_price);
  }
  load_query_page();
});
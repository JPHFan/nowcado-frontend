$("div.pagination a, div.sidebar-nav.well a, div.sidebar-nav.well input:radio, li.dropdown ul a").click(function(e) {
  e.preventDefault();
  append_query_string($(this).attr("value"),$(this).attr("id"));
  load_query_page();
});

$("#filter_reset").click(function(e) {
  e.preventDefault();
  $("#query_string").val("/search?search=" + getParameterByName("search") + "&latitude=" + getParameterByName("latitude") + "&longitude=" + getParameterByName("longitude"));
  load_query_page();
});

$("div.sidebar-nav.well input:checkbox").click(function(e) {
  var set_filter = false;
  if($(this).attr("checked") == "checked") {
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
      append_query_string("department_"+$(this).attr("id"),set_filter);
  }
  load_query_page();
});

$("#price_filter").click(function(e) {
  e.preventDefault();
  var min_price = $("#min_price").val();
  var max_price = $("#max_price").val();
  append_query_string("min_price",min_price);
  append_query_string("max_price",max_price);
  load_query_page();
});

function load_query_page() {
  var new_query = $("#query_string").val();
  if(new_query != window.location.href) {
    window.location = new_query;
  }
}

function append_query_string(key, value) {
  var query_string = $("#query_string");
  var uri = query_string.val();
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    query_string.val(uri.replace(re, '$1' + key + "=" + value + '$2'));
  } else {
    query_string.val(uri + separator + key + "=" + value);
  }
}
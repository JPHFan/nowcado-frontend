var selected_departments = {};

function update_search_results_width() {
  var filter_ref = $(".pull-left");
  var filter_width = filter_ref.width();
  var row_width = filter_ref.parent().width();
  filter_ref.next().width((row_width-filter_width) + "px");
}

$(document).ready(function() {
  // Add the applied filters value to the query string
  var applied_filters_sha_str = $("div#applied_filters_sha").attr("sha");
  if(applied_filters_sha_str == null)
    return;
  append_query_string("applied_filters_sha",applied_filters_sha_str);

  // Update widths appropriately
  var filter_width = 150;

  $("div.well.sidebar-nav table td").each(function() {
    var temp = $(this).textWidth()+52;
    if(temp > filter_width) {
      filter_width = temp;
    }
  });
  $("div.well.sidebar-nav").width(filter_width + "px");
  update_search_results_width();
});

var width = $(window).width();
$(window).resize(function() {
  if($(this).width() != width) {
    width = $(this).width();
    update_search_results_width();
  }
})

$("div.pagination a, li.dropdown ul a").click(function(e) {
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
      var key = $(this).attr("key");
      var term = $(this).attr("term");
      if(key != null && term != null) {
        if(selected_departments[key] == null) {
            selected_departments[key] = [];
        }
        if(set_filter) {
          selected_departments[key].push(term);
        } else {
          var select_index = selected_departments[key].indexOf(term);
          if(select_index != -1) {
            selected_departments[key].splice(select_index,1);
          }
        }
      }
      append_query_string("selected",encodeURIComponent(JSON.stringify(selected_departments)));
  }
  // Do not refresh page until clicking apply
});

$("#apply_filters").click(function(e) {
  e.preventDefault();
  var min_price = $("#min_price").val();
  var max_price = $("#max_price").val();
  var max_distance = $("#max_distance").val();
  if(min_price != "") {
    append_query_string("min_price",min_price);
  } else {
    remove_query_string("min_price");
  }
  if(max_price != "") {
    append_query_string("max_price",max_price);
  } else {
    remove_query_string("max_price");
  }
  if(max_distance != "") {
    append_query_string("max_distance",max_distance);
  } else {
    remove_query_string("max_distance");
  }
  load_query_page();
});
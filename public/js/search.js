var selected_departments = {};
var applied_selections_ordered = [];

function update_search_results_width() {
  var filter_ref = $("div#search_filter_div.pull-left");
  var filter_width = filter_ref.width();
  var row_width = filter_ref.parent().width();
  filter_ref.next().width((row_width-filter_width) + "px");
}

$(document).on('click','.tag-cloud', function removeTag(){
    var parent = $(this).parent();
    $(this).remove();
    $("#prev_applied_popover").attr("data-content",parent.html());
});

// Find out which containers we have on this document and setup proper bindings
$(document).ready(function() {
	if ( $("#tag").length > 0 ) { addTagBindings('#tag'); }
	if ( $("#tag-info").length > 0 ) { addTagBindings('#tag-info');	}
	if ( $("#tag-success").length > 0 ) { addTagBindings('#tag-success'); }
	if ( $("#tag-warning").length > 0 ) { addTagBindings('#tag-warning'); }
	if ( $("#tag-danger").length > 0 ) { addTagBindings('#tag-danger');	}
	if ( $("#tag-inverse").length > 0 ) { addTagBindings('#tag-inverse');	}
});


// Dynamically apply bindings based on the type of tag cloud that was
// detected on the page that includes this .js module
function addTagBindings(id) {
		$(id + ' > button').click(function(){ addTag(id); });
		$(id + ' > input').keyup(function (e) {  if (e.keyCode == 13) { addTag(id); }  });
}

$(document).ready(function() {
  // Add the applied filters value to the query string
  var applied_filters_str = $("div#applied_filters").attr("sha");
  var applied_selections_ordered_json = $("div#applied_selections_ordered").attr("json");
  if(applied_selections_ordered_json !== undefined)
    applied_selections_ordered = JSON.parse(decodeURIComponent(applied_selections_ordered_json.replace("+"," ")));
  if(applied_filters_str == null)
    return;
  append_query_string("applied_filters",applied_filters_str);
  append_query_string("selected",encodeURIComponent(JSON.stringify(selected_departments)));
  append_query_string("multiple_selections",encodeURIComponent(JSON.stringify(applied_selections_ordered)));

  // Update widths appropriately
  var filter_width = 150;

  $("div.well.sidebar-nav table td").each(function() {
    var temp = 52+$(this).textWidth();
    if(temp > filter_width) {
      filter_width = temp;
    }
  });
  $("div.well.sidebar-nav").width(filter_width + "px");
  update_search_results_width();

  var tmp = $.fn.popover.Constructor.prototype.show;
  $.fn.popover.Constructor.prototype.show = function() {
    tmp.call(this);
    if(this.options.callback) {
      this.options.callback();
    }
  }

  $("#prev_applied_popover").popover({callback: function() {
    $(".popover").width($("#tag-cloud").width() + 24);
  }});
});

var width = $(window).width();
$(window).resize(function() {
  if($(this).width() != width) {
    width = $(this).width();
    update_search_results_width();
  }
});

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
  var qs = $("#query_string").val();
  qs = qs.substring(qs.indexOf("?")+1).split('&');
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
      var append = false;
      // If all values are empty, must delete the selected key
      for(var select in selected_departments) {
        if(selected_departments[select].length > 0) {
          append = true;
          break;
        }
      }
      if(append) {
        append_query_string("selected",encodeURIComponent(JSON.stringify(selected_departments)));
      } else {
        remove_query_string("selected");
      }

  }
  // Do not refresh page until clicking apply
});

$("#apply_filters").click(function(e) {
  e.preventDefault();
  remove_query_string("page");
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
  // calculate prev applied filters and see if it is any different. If so, must use that form of query by removing applied_filters hash
  var new_applied_selections_ordered = [];
  $('<div/>').html($("#prev_applied_popover").attr("data-content")).find("li.tag-cloud").each(function(index) {
    var select_str = $(this).html().split(":");
    if(select_str.length == 2) {
      var key = select_str[0];
      var val = select_str[1].split(",").map(function(s) {return s.trim()});
      if(val.length > 0) {
        var hash = {};
        hash[key] = val;
        new_applied_selections_ordered.push(hash);
      }
    }
  });

  if(JSON.stringify(new_applied_selections_ordered) != JSON.stringify(applied_selections_ordered)) {
    append_query_string("multiple_selections",encodeURIComponent(JSON.stringify(new_applied_selections_ordered)));
    remove_query_string("applied_filters");
  } else {
    append_query_string("applied_filters",$("div#applied_filters").attr("sha"));
  }

  load_query_page();


});
var item_cache = {}, item_id_map = {};
// Index functions
if(getParameterByName("fail") == "true") {
  $("#location_search_error").html(error_string.location_not_set);
  $("#location_search_error").show();
}
function geo_process(position) {
  $.post("/set_location/", { latitude: position.coords.latitude, longitude: position.coords.longitude }, function() {
    alert_success("#location_status",success_string.location_set);
    map_location(position.coords.latitude, position.coords.longitude, "location_search_map");
    $("#latitude").val(position.coords.latitude);
    $("#longitude").val(position.coords.longitude);
    get_recently_purchased();
    $("#location_found_div").show();
    $(".navbar-search input").effect("highlight", {color: '#96F52F'}, 3000);
    $("#location_search_error").hide();
    $("#use_current_loc").button('reset');
  });
}

function get_recently_purchased() {
    var recently_purchased = $("#recently_purchased");
    recently_purchased.html("");
    cors_call("/items/recently_purchased?latitude=" + $("#latitude").val() + "&longitude=" + $("#longitude").val(),{},function(json) {
      if(json.success) {
        for(var i = 0; i < json.result.length; i++) {
          var item = json.result[i];
          recently_purchased.append('<a href="/item/' + item.id + '?store_ids=%5B' + encodeURIComponent(item.store_ids) + '%5D" style="width: 210px;color:#555555;text-decoration:none"><div class="thumbnail" style="height:270px"><h6 style="height:50px;width:200px">' + item.name + '</h6><img src="' + domain + item.img_url + '" style="max-width:200px;height:200px"></div></a>');
        }
        recently_purchased.carouFredSel({scroll:{duration:1000}});
      }
    },"GET");
}

// Assume SF
function geo_declined(error) {
  geo_process({coords:{latitude:37.775,longitude:-122.418333}});
  /*$("#use_current_loc").button('reset');
  alert_error("#location_status",error_string.auto_location_denied);*/
}

function autolocate() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_process, geo_declined);
  } else {
    geo_process({coords:{latitude:37.775,longitude:-122.418333}});
    /*alert_error("#location_status",error_string.auto_location_support);
    $(this).button('reset');*/
  }
}

$(document).ready(autolocate);

$("#search_explanation_text").hover(
  function() {
    $(".navbar-search input").css("backgroundColor","#96F52F");
  }, function() {
    $(".navbar-search input").css("backgroundColor","#FFFFFF");
  }
);

$("#cart_explanation_text").hover(
  function() {
    $("#add_cart_item_input").css("backgroundColor","#96F52F");
  }, function() {
    $("#add_cart_item_input").css("backgroundColor","#FFFFFF");
  }
);

$( "#add_cart_item_input" ).autocomplete({
    minLength: 3,
    source: function( request, response ) {
        var term = request.term, latitude = $("#latitude").val(), longitude = $("#longitude").val();
        if ( term in item_cache ) {
            response( item_cache[ term ] );
            return;
        }

        if(latitude && longitude && latitude.trim() != "" && longitude.trim() != "") {
            cors_call("/items?latitude=" + latitude + "&longitude=" +  $("#longitude").val() + "&name=" + term,{}, function(data) {
                // Convert data in to an array of strings
                // Also build up item_id_map
                if(data.success) {
                    var temp_item_arr = [];
                    for(var idx = 0; idx < data.result.length; idx++) {
                        var item = data.result[idx], name = item["name"].trim();
                        temp_item_arr.push(name);
                        item_id_map[name] = item["id"];
                    }
                    item_cache[term] = temp_item_arr;
                    response(temp_item_arr);
                }
            }, "GET");
        }
    }
}).keyup(function (e) {
  if(e.which === 13) {
    $(".ui-menu-item").hide();
  }
});

$("#cart_list_form").submit(function(e) {
  e.preventDefault();
  var name = $("#add_cart_item_input").val().trim();
  var nid;
  if(item_id_map[name] !== undefined) {
    // Fill out the table here
    nid = item_id_map[name];
  } else if(item_cache[name] !== undefined && item_cache[name].length > 0) {
    // Try to set the name and nid to the first autocomplete option, if present
    name = item_cache[name][0];
    nid = item_id_map[name];
  }
  if(nid !== undefined) {
    $("tbody#cart_items_list").prepend("<tr><td><span nid=\"" + nid + "\" class=\"badge closable\" data-original-title=\"Remove from list\" data-placement=\"left\">x</span>" + name + "</td></tr>");
    $("tbody#cart_items_list tr td span.badge.closable").tooltip("hide");
    $.post("/cart/temp/add",{id:nid,name:name},function(json) { },"json");
  }
  $("#add_cart_item_input").val("");

});

$("tbody#cart_items_list").on("click","tr td span.badge.closable", function() {
  $.post("/cart/temp/remove",{id:$(this).attr("nid")},function(json) { },"json");
  $(this).parents("tr").remove();
});

$("#quick_set_cart").click(function(e) {
  e.preventDefault();
  if($("#edit_account_link").length < 1) {
    $("#sign_in").modal("show");
    return;
  }
  var ids = $("tbody#cart_items_list tr td span.badge.closable").map(function() {
    return $(this).attr("nid");
  }).get().join("%2C");

  $.post("cart/items",{ids: ids}, function(json) {
      if(json.success) {
        window.location = "/cart_list";
      } else {
        $.growl(json.message,growl_resp.fail);
      }
  },"json");
});

$("#location_search_form").submit(function(e) {
  e.preventDefault();
  if($("#location_search").val().trim() == "") {
    autolocate();
  }
  else {
    $("#ui-id-1").children("li").first().children("a").mouseover();
    geo_process({
      coords: {
          latitude: $("#latitude").val(),
          longitude: $("#longitude").val()
      }
    });
  }
});

$(function() {
  var addresspicker_map = $("#location_search").addresspicker({
    elements: {
      map: "#location_search_map",
      lat: "#latitude",
      lng: "#longitude"
    }
  });
  var marker = addresspicker_map.addresspicker("marker");
  marker.setVisible(true);
  addresspicker_map.addresspicker("updatePosition");
  $("tbody#cart_items_list tr td span.badge.closable").tooltip("hide");
});
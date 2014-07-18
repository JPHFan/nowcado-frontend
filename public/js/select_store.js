var store_addresspicker_map, store_map_markers = [], store;
function updateStoreMarkers() {
  var store_map_bounds = store_addresspicker_map.getBounds(), store_map_center = store_addresspicker_map.getCenter();
  // Do backend call and replace set of store store_map_markers as well as fixing up the table
  cors_call("/stores/nearby_stores?lat=" + store_map_center.lat() + "&lng=" + store_map_center.lng() + "&ne=" + store_map_bounds.getNorthEast().toUrlValue() + "&sw=" + store_map_bounds.getSouthWest().toUrlValue(),{},function(json){
    if(!json.success) return;
    // Wipe all existing store_map_markers
    for(var i = 0; i < store_map_markers.length; i++) store_map_markers[i].setMap(null);
    store_map_markers = [];
    
    // Clear out the table
    $("#known_stores_table").html("");

    // Render the store_map_markers and table
    for(var i = 0; i < json.result.length; i++) {
      var letters = "";
      if (i < 26){
        letters = String.fromCharCode(65+i);
      } else {
        letters = String.fromCharCode(65+(parseInt((i-26) / 26))) + String.fromCharCode(65+(i % 26));
      }
      var cur_store = json.result[i], 
          store_icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+letters+'|FF0000|000000';
      store_map_markers.push(new google.maps.Marker({
        position: new google.maps.LatLng(cur_store.latitude, cur_store.longitude),
        map: store_addresspicker_map,
        icon: store_icon        
      }));
      $("#known_stores_table").append('<tr onclick="store={storeName:\'' + cur_store.name + '\',storeId:' + cur_store.id + '};findStoreRequestSuccess();"><td><img src="' + store_icon + '"></img></td><td>' + cur_store.name + '</td><td>' + cur_store.address + '</td></tr>');
    }
    
  },"GET");
}

function findStoreRequestFailed(name){
  $("#new_store_name").html(name);
  $("#addItemSuccessStatus").html("").hide();
  $(".carousel").carousel(3);
}

function findStoreRequestSuccess() {
  $("#add_store_name").html(store.storeName);
  $("#addItemSuccessStatus").html("").hide();
  $(".carousel").carousel(4);
}

$(function() {
  var store_addresspicker = $("#store_address_search").addresspicker({
    elements: {
      map: "#store_map",
      lat: "#store_lat",
      lng: "#store_lng"
    }
  });
  store_addresspicker.addresspicker("updateAndHidePosition");
  store_addresspicker_map = store_addresspicker.addresspicker("map");
  
  google.maps.event.addListener(store_addresspicker_map, 'idle', function() {
    updateStoreMarkers();
    google.maps.event.trigger(store_addresspicker_map,"resize")
  });
});

$("form#map_search_form").submit(function(e) {
  e.preventDefault();
  $("#ui-id-1").children("li").first().children("a").mouseover();
});

$("form#new_store_form").submit(function(e) {
  e.preventDefault();
  // Do places API call
  var cur_lat_lng = store_addresspicker_map.getCenter().lat() + "," + store_addresspicker_map.getCenter().lng(),
      store_name_input = $("#store_name_input").val();
  $.getJSON("/store/unlisted", {
    location: cur_lat_lng,
    query: store_name_input
  }, function(data) {
    if (data.results.length > 0){
      var found_store = data.results[0];
      store = {
        storeName: found_store.name,
        address: found_store.formatted_address,
        lat: found_store.geometry.location.lat,
        lng: found_store.geometry.location.lng
      };
      // We successfully picked a store, go to the next page.
      // Set name
      $("#found_store_name").html(found_store.name);
      // Set address
      $("#found_store_address").html(found_store.formatted_address);
      $("#addItemSuccessStatus").html("").hide();
      $(".carousel").carousel(2);
    } else {
      findStoreRequestFailed(store_name_input);
    }
  });
});

$("form#new_store_address_form").submit(function(e) {
  e.preventDefault();
  // Perform geocode on address
  var store_address = $("#store_address_input").val();
  new google.maps.Geocoder().geocode({'address':store_address}, function(results,status) {
    if(status != google.maps.GeocoderStatus.OK) {alert("Geocoding failed" + (status.error_message ? (": "+status.error_message) : ""));return;}
    store = {storeName: $("#new_store_name").html(), address: store_address, lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
    findStoreRequestSuccess();
  });
});

$("[redir]").click(function(e) {
  e.preventDefault();
  var p = $(this).attr("prompt");
  if(!!p) {
    if(!confirm(p)) return;
    resetAddItemTable();
  }
  $("#addItemSuccessStatus").html("").hide();
  $('.carousel').carousel(parseInt($(this).attr('redir')));
});

// Do not let bootstrap auto-cycle
$.fn.carousel.defaults = {interval: false, pause: 'hover'};
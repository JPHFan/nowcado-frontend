// Index functions
if(getParameterByName("fail") == "true") {
  $("#location_search_error").html(error_string.location_not_set);
  $("#location_search_error").show();
}
function geo_process(position) {
  $.post("/set_location/", { latitude: position.coords.latitude, longitude: position.coords.longitude }, function() {
    alert_success("#location_status",success_string.location_set);
    map_location(position.coords.latitude, position.coords.longitude);
  });
}

function geo_declined(error) {
  $("#use_current_loc").button('reset');
  alert_error("#location_status",error_string.auto_location_denied);
}

function map_location(latitude, longitude) {
  var center = new google.maps.LatLng(latitude, longitude);
  var map_options = {
    center: center,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("location_search_map"), map_options);
  var marker = new google.maps.Marker({
    position: center,
    map: map
  });
  $("#latitude").val(latitude);
  $("#longitude").val(longitude);
  $("#location_found_div").show();
  $("#location_search_map").addClass("alert");
  $(".navbar-search input").effect("highlight", {color: '#96F52F'}, 3000);
  $("#location_search_error").hide();
  $("#use_current_loc").button('reset');
}

$("#use_current_loc").click(function(e) {
  e.preventDefault();
  $(this).button('loading');
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_process, geo_declined);
  } else {
    alert_error("#location_status",error_string.auto_location_support);
    $(this).button('reset');
  }
});

$("#search_explanation_text").hover(
  function() {
    $(".navbar-search input").css("backgroundColor","#96F52F");
  }, function() {
    $(".navbar-search input").css("backgroundColor","#FFFFFF");
  }
);

$("#location_search_form").submit(function(e) {
  e.preventDefault();
  geo_process({
    coords: {
      latitude: $("#latitude").val(),
      longitude: $("#longitude").val()
    }
  });

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
});

$("#manual_loc_button").click(function(e) {
  e.preventDefault();
  $(this).hide();
  $("#location_search_form").show();
});
var domain = $("#domain").val();
var error_string = {
  auto_location_support: "Your browser does not support automatic location detection.",
  auto_location_denied: "If you would like to automatically be located, you must accept location detection."
}
var success_string = {
  location_set: "Your location has been successfully set.",
}

function alert_error(div_id, error_string) {
  $(div_id).removeClass("alert-success").addClass("alert-error").html(error_string).show();
}

function alert_success(div_id, success_string) {
  $(div_id).removeClass("alert-error").addClass("alert-success").html(success_string).show();
}

function alert_load(div_id,duration) {
  $(div_id).removeClass().addClass("progress progress-striped active").html("<div class='bar' style='width: 0''></div>").children().animate({
    width: '100%'
  },duration);
}

$(".navbar .navbar-form").submit(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/sign_in?callback=?", { user: {email: $(".navbar .navbar-form input:first").val(), password: $(".navbar .navbar-form input:last").val()} }, function(json) {
    if(json.success) {
      $("#user_bar").tooltip("destroy");
      $("#user_bar").load("/user_bar/" + JSON.stringify(json.result));
    }
    else {
      $(".navbar .navbar-form")
        .attr("data-original-title", json.message)
        .tooltip("show")
    }
  });
});

function geo_process(position) {
  $.post("/set_location/", { latitude: position.coords.latitude, longitude: position.coords.longitude }, function() {
    alert_success("#location_status",success_string.location_set);
    map_location(position.coords.latitude, position.coords.longitude);
  });
}

function geo_declined(error) {
  alert_error("#location_status",error_string.auto_location_denied);
}

function map_location(latitude, longitude) {
  var center = new google.maps.LatLng(latitude, longitude);
  var map_options = {
    center: center,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  var map = new google.maps.Map(document.getElementById("location_search_map"), map_options);
  var marker = new google.maps.Marker({
    position: center,
    map: map
  });
  $("#location_found_div").show();
  $("#location_search_map").addClass("alert");
  $(".navbar-search input").effect("highlight", {color: '#96F52F'}, 3000);
}

$("#use_current_loc").click(function(e) {
  e.preventDefault();
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_process, geo_declined);
  } else {
    alert_error("#location_status",error_string.auto_location_support);
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
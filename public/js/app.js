// Global functions
var domain = $("#domain").val();
var error_string = {
  auto_location_support: "Your browser does not support automatic location detection.",
  auto_location_denied: "If you would like to automatically be located, you must accept location detection.",
  location_not_set: "You must set your location before searching."
};
var success_string = {
  location_set: "Your location has been successfully set."
};

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

$(".brand").tooltip("hide");

$(".navbar .navbar-form").submit(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/sign_in?callback=?", { user: {email: $(".navbar .navbar-form input:first").val(), password: $(".navbar .navbar-form input:last").val()} }, function(json) {
    if(json.success) {
      $(".navbar .navbar-form").tooltip("destroy");
      $("#user_bar").load("/user_bar/" + JSON.stringify(json.result));
    }
    else {
      $(".navbar .navbar-form")
        .attr("data-original-title", json.message)
        .tooltip("show")
    }
  });
});

function latlon_defined() {
  var lat = $("#latitude").val();
  var lon = $("#longitude").val();
  if(lat == "" || lat == "NaN" || lat == "/" || lon == "" || lon == "NaN" || lon == "/") {
    return false;
  } else {
    return true;
  }
}

$(".navbar-search").submit(search_action);
$(".navbar-search a").click(search_action);

function search_action(e) {
  e.preventDefault();
  if(!latlon_defined()) {
    window.location = "/?fail=true"; //$(".container:first").load("/");
    return;
  }
  var query = $(".navbar-search input").val();
  $.getJSON(domain + "/search?callback=?", { latitude: $("#latitude").val(), longitude: $("#longitude").val(), search: query }, function(json) {
    if(json.success) {
      $("#search_query").val(query);
      $(".navbar-search").tooltip("destroy");
      $.post("/search/?q=" + query, json.result, function(search_result) {
        $(".container:first").html(search_result);
      });
    }
    else {
      $(".navbar-search")
        .attr("data-original-title", json.message)
        .tooltip("show");
    }
  });
}

function getParameterByName(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g," "));
}
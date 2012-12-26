var domain = $("#domain").val();
$(".navbar .navbar-form").submit(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/sign_in?callback=?", { user: {email: $(".navbar .navbar-form input:first").val(), password: $(".navbar .navbar-form input:last").val()} }, function(json) {
    if(json.success) {
      $("#user-bar").tooltip("destroy");
      $("#user-bar").load("/user_bar/" + JSON.stringify(json.result));
    }
    else {
      $(".navbar .navbar-form")
          .attr("data-original-title", json.message)
          .tooltip("show")
    }
  });
});
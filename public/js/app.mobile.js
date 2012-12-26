var domain = $("#domain").val();
$("#sign-in-form").submit(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/sign_in?callback=?", { user: {email: $("#sign-in-form input#email-input").val(), password: $("#sign-in-form input#password-input").val()} }, function(json) {
    if(json.success) {
      $.get("/user_bar/" + JSON.stringify(json.result), function() { window.location = "/"; });
    }
    else {
      $("#error-div").html("<b style='color: red'>" + json.message + "</b>");
    }
  });
});
$(".brand").tooltip("hide");

$(".navbar .navbar-form").submit(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/sign_in?callback=?", { user: {email: $(".navbar .navbar-form input:first").val(), password: $(".navbar .navbar-form input:last").val()} }, function(json) {
    sign_in(json);
  });
});

$(".navbar-search").submit(search_action);
$(".navbar-search a").click(function(e) {
  search_action(e);
  e.preventDefault();
  $(".navbar-search").submit();
});

$(document).ready(set_stars());

$("#sign_up_submit").click(function(e) {
  e.preventDefault();
  $.getJSON(domain + "/users/create?callback=?", { user: {email: $("#sign_up_email").val(), username: $("#sign_up_username").val(), password: $("#sign_up_password").val()}}, function(json) {
    if(json.success) {
      $("#sign_up_email_error,#sign_up_username_error,#sign_up_password_error").hide();
      $("#sign_up").modal("hide");
      alert("Account was successfully created.\nConfirm the account with the email you received to sign in.");
    } else {
      //display an error somewhere, probably as a popover
      if(json.message.email != null) {
        $("#sign_up_email_error").html(concat_err_string(json.message.email,"email")).show();
      }
      if(json.message.username != null) {
        $("#sign_up_username_error").html(concat_err_string(json.message.username,"username")).show();
      }
      if(json.message.password != null) {
        $("#sign_up_password_error").html(concat_err_string(json.message.password,"password")).show();
      }
    }
  });
});


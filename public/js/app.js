$(".navbar a").tooltip("hide");

// Perform a CORS call to the backend.
function cors_call(url, params, callback, method){
  method = ((typeof method !== 'undefined') ? method : 'GET');

  $.ajax({
    url: domain + "" + url,
    type: method,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(params),
    statusCode: {
      200: callback,
      500: function(data){
        modalAlert("Error 500","Sorry, we messed something up. Please bear with us, we're working on it.");
      },
      502: function(data){
        modalAlert("Error 502","Our config appears to be hosed. Employing the slaves - er, interns - to recover.");
      },
      503: function(data){
        modalAlert("Error 503","Help, we're drowning!... Please try again later.");
      },
      504: function(data){
        modalAlert("Error 504","WHERE NOWCADO GO?!?... Please try again later.");
      },
      404: function(data){
        modalAlert("Error 404","I'm sorry, I'm afraid I can't do that.");
      },
      422: function(data){
        modalAlert("Error 422","Whatchu talkin' 'bout?");
      }
    },
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true
  });
}

$(".navbar .navbar-form").submit(function(e) {
  e.preventDefault();
  // Sign in via a CORS call to the backend.
  cors_call("/users/sign_in", {
      email: $(".navbar .navbar-form input:first").val(),
      password: $(".navbar .navbar-form input:last").val()
    },
    function(json) {
      sign_in(json);
    },
    "POST"
  );
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
  cors_call("/users", {
    email: $("#sign_up_email").val(),
    username: $("#sign_up_username").val(),
    password: $("#sign_up_password").val()},
    function(json) {
      if(json.success) {
        $("#sign_up_email_error,#sign_up_username_error,#sign_up_password_error").hide();
        $("#sign_up").modal("hide");
        modalAlert("Account Created.","Confirm the account with the email you received to sign in.");
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
    },
    "POST"
  );
});

FB.init({
  appId      : '498305683523319',
  status     : true, // check login status
  cookie     : true, // enable cookies to allow the server to access the session
  xfbml      : true  // parse XFBML
});

$("#facebook_login_icon").tooltip("hide").click(function(e) {
  FB.login(function(response) {
    // Handle the response
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they
      // have logged in to the app.
      cors_call("/users/sign_in_facebook", {
          access_token: response.authResponse.accessToken
        },
        function(json) {
          sign_in(json);
          document.cookie = "";
        },
        "POST"
      );
    }
 }, {scope: 'email'});
});

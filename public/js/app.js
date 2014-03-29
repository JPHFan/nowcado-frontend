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

// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below
// will be handled.
FB.Event.subscribe('auth.authResponseChange', function(response) {
  // Here we specify what we do with the response anytime this event occurs.
  if (response.status === 'connected') {
    // The response object is returned with a status field that lets the app know the current
    // login status of the person. In this case, we're handling the situation where they
    // have logged in to the app.
    // TODO

  } else if (response.status === 'not_authorized') {
    // In this case, the person is logged into Facebook, but not into the app, so we call
    // FB.login() to prompt them to do so.
    // In real-life usage, you wouldn't want to immediately prompt someone to login
    // like this, for two reasons:
    // (1) JavaScript created popup windows are blocked by most browsers unless they
    // result from direct interaction from people using the app (such as a mouse click)
    // (2) it is a bad experience to be continually prompted to login upon page load.
    //FB.login();
  } else {
    // In this case, the person is not logged into Facebook, so we call the login()
    // function to prompt them to do so. Note that at this stage there is no indication
    // of whether they are logged into the app. If they aren't then they'll see the Login
    // dialog right after they log in to Facebook.
    // The same caveats as above apply to the FB.login() call here.
    //FB.login();
  }
});

$("#facebook_login_icon").click(function(e) {
  FB.login();
});

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

$("#sign-in-form").submit(function(e) {
  e.preventDefault();
  // Do nothing if missing a param
  var email = $("#sign-in-form input:first").val();
  var pass = $("#sign-in-form input:last").val();
  if(email == "" || pass == "")
    return;
  // Sign in via a CORS call to the backend.
  cors_call("/users/sign_in", {
      email: email,
      password: pass
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
  if($(this).attr("id") == "browse") {
      $("#search-text").val("");
  }
  $(".navbar-search").submit();
});

$("#forgot_password_link").click(function(e) {
    e.preventDefault();
    // If email DNE then show an error asking them to enter it first
    var email = $("#sign-in-form input:first").val();
    if(email == "") {
        $("#sign_in_error").html("Must enter in an email to send reset password instructions to.").show();
        return;
    }
    $("#sign_in_error").hide();
    // Sign in via a CORS call to the backend.
    cors_call("/users/reset_password", {
        email: email
      },
      function(json) {
        if(json.success) {
          // Close out the modal and show dialog saying we have email them password reset instructions
          $("#sign_in").modal("hide");
          modalAlert("Instructions sent","Please check your email for instructions to reset your password.");
        } else {
          $("#sign_in_error").html(json.message).show();
        }
      },
      "POST"
    );
});

$(document).ready(set_stars());

$("#sign_up_submit").click(function(e) {
  e.preventDefault();
  cors_call("/users", {
    email: $("#sign_up_email").val(),
    username: $("#sign_up_username").val(),
    password: $("#sign_up_password").val()},
    function(json) {
      $("#sign_up_email_error,#sign_up_username_error,#sign_up_password_error").hide();
      if(json.success) {
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
$("#google_login_icon").tooltip("hide");
$("#facebook_login_icon").tooltip("hide").click(function(e) {
  e.preventDefault();
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
        },
        "POST"
      );
    } else {
      $("#sign_in_error").html(response.status).show();
    }
 }, {scope: 'email'});
});

$("#google_login_icon").click(function(e) {
  e.preventDefault();
  gapi.auth.signIn({
      'callback':googleSignIn,
      'clientid':"1084976520334-372n755g0pshf06vvae80a2fcg5dc9r1.apps.googleusercontent.com",
      'cookiepolicy':"single_host_origin",
      'scope':"email"
  });
});

function googleSignIn(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    cors_call("/users/sign_in_googleplus", {
      access_token: authResult['access_token']
    },
    function(json) {
      sign_in(json);
    },
    "POST"
    );
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    if(authResult['error'] == "access_denied") {
      $("#sign_in_error").html("You must grant Nowcado access to sign in.").show();
    } else if (authResult['error'] == "user_signed_out") {
      $("#sign_in_error").html("You must successfully sign in to use this account.").show();
    }
  }
}
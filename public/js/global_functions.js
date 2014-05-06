// Global functions
var domain = $("#domain").val();
var error_string = {
  auto_location_support: "Your browser does not support automatic location detection.",
  auto_location_denied: "We were unable to get your location.",
  location_not_set: "You must set your location before performing a search."
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

function sign_in(json) {
  if(json.success) {
    $(".navbar .navbar-form").tooltip("destroy");
    // Use the encrypted auth token for further requests
    $("#user_bar").load("/user_bar/" + json.result.username + "?email=" + json.result.email +
        "&auth_token=" + json.result.auth_token + "&ssid=" + json.result.ssid + "&store_owner=" + json.result.store_owner);
  } else {
    $(".navbar .navbar-form")
      .attr("data-original-title", json.message)
      .tooltip("show")
    if (json.message.substring(0,"FB Error:".length) === "FB Error:"){
      modalConfirm("Facebook Error", json.message.substring("FB Error: ".length) + "<br/>You must refresh the page.  Do you wish to do so now?", "window.location.reload(true)");
    }
  }
}

function latlon_defined() {
  var lat = $("#latitude").val();
  var lon = $("#longitude").val();
  if(lat == "" || lat == "NaN" || lat == "/" || lon == "" || lon == "NaN" || lon == "/") {
    return false;
  } else {
    return true;
  }
}

function map_location(latitude, longitude, map_id, zoom) {
  if(zoom === undefined) {
    zoom = 17;
  }
  var center = new google.maps.LatLng(latitude, longitude);
  var map_options = {
    center: center,
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $("#" + map_id).html("");
  var map = new google.maps.Map(document.getElementById(map_id), map_options);
  var marker = new google.maps.Marker({
    position: center,
    map: map
  });
  $("#" + map_id).addClass("alert");
  return map;
}

function search_action(e) {
  if(!latlon_defined()) {
    e.preventDefault();
    window.location = "/?fail=true";
    return;
  }
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

function load_query_page() {
  var new_query = $("#query_string").val();
  if(new_query != window.location.href) {
    window.location = new_query;
  }
}

function append_query_string(key, value) {
  var query_string = $("#query_string");
  var uri = query_string.val();
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    query_string.val(uri.replace(re, '$1' + key + "=" + value + '$2'));
  } else {
    query_string.val(uri + separator + key + "=" + value);
  }
}

function remove_query_string(key) {
  var query_string = $("#query_string");
  var uri = query_string.val();
  var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
  if (uri.match(re)) {
    uri = uri.replace(re, '$1');
    if(uri.substring(uri.length-1).match('([?|&])')) {
      uri = uri.substring(0,uri.length-1);
    }
    query_string.val(uri);
  }
}

function set_stars() {
  $(".star.read-only").raty({
    readOnly: true,
    score: function() { return $(this).attr("data-rating"); }
  });
  $(".star.read-write").raty({
    score: function() { return $(this).attr("data-rating"); }
  });
}

function concat_err_string(errs,str) {
  var i = 0;
  var err = "";
  $.each(errs, function(index,val) {
    if(i > 0) {
      err += " and ";
    }
    if(str != null) {
      err += str;
    } else {
      err += index;
    }
    err += " " + val;
    i++;
  });
  return err;
}

function cap_words(str) {
  return str;
}

function modalAlert(header, body) {
  $("#modalAlertHeader").html(header);
  $("#modalAlertBody").html(body);
  $("#modalAlertFooter").html('<button class="btn" data-dismiss="modal" aria-hidden="true">OK</button>')
      .parent().modal("show");
}

// You can only pass a function as a string with only string arguments for modelConfirm.
function modalConfirm(header, body, fn_string) {
  $("#modalAlertHeader").html(header);
  $("#modalAlertBody").html(body);
  $("#modalAlertFooter").html('<button class="btn btn-primary" data-dismiss="modal" onclick="'+fn_string+'">OK</button><button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>')
      .parent().modal("show");
}

// item ids must be in the order: selected item, similar1 sorted, similar2 sorted, ...
function addToCart(item_ids, quantity, sum, notify, refresh) {
  $.ajax({
    url:"/cart/item/"+item_ids[0],
    type: sum==true ? "POST" : "PUT",
    data: {quantity: quantity, item_ids: item_ids},
    dataType: "json",
    success: function(json){
      if(notify != true) {

      } else {
        if (json.success && json.result !== undefined){
          var plur_text = "There are now ";
          var qty = json.result[item_ids.join(",")][0].quantity ;
          if (qty <= 1){
            plur_text = "There is now ";
          }
          $("#qty_confirm_text").html(plur_text + qty);
          $("#add_item_alert").show();

          // Highlight the cart tooltip to make it more visible
          $("#cart_link").tooltip("show");
        }
        else{
          // You were not able to add the item to your cart - limit reached.
          $("#add_item_alert").hide();
          $("#add_item_fail").html(json.message).show();
        }
      }
      if(refresh)
        window.location.reload(true);
    }
  });
}

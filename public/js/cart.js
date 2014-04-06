var CART_RETRY_INTERVAL_MS = 1000;

$(document).ready(function() {
  $("#cart_preferences_ranking").sortable({
    placeholder: "ui-state-highlight"
  });
//  $("#cart_preferences_ranking").disableSelection();
  update_preferences_ranking_dropdowns();

  $.getJSON("/cart/itinerary", {}, function(json){
    if (!json.success){
      var alert_div = $("#cart_alert");
      var alert_text = alert_div.html();
      var dots = 0;
      var cart_retry = window.setInterval(function() {
        $.getJSON("/cart/itinerary", {}, cart_retry_func);
      }, CART_RETRY_INTERVAL_MS);
      function cart_retry_func(json){
        if (json.success){
          window.clearInterval(cart_retry);
          location.reload(true);
        } else {
            // Append loading dots
            var temp_text = alert_text;
            for(var i = 0; i < dots%4; i++)
              temp_text += ".";
            alert_div.html(temp_text);
            dots++;
        }
      }
    }
    else{
      if ($("#cart_alert").html() !== undefined){
        location.reload(true);
      }
    }
  });
});

$("#cart_preferences_ranking").on("sortupdate", function(event, ui) {
  update_preferences_ranking_dropdowns();
});

$("#cart_preferences_ranking select").change(function(e) {
  update_preferences_ranking_list_order($(this));
  update_preferences_ranking_dropdowns();
});

$("#cart_preferences_submit").click(function(e) {
  var max_distance = $("#cart_preferences_max_distance").val();
  var max_stores = $("#cart_preferences_max_stores").val();
  var min_rating = $("#cart_preferences_min_rating").val();
  var sorted_values = $("#cart_preferences_ranking").sortable("toArray", {attribute: "value"});
  $.ajax({
    url: "/cart/preferences",
    type: "PUT",
    data: {max_distance:max_distance, max_stores: max_stores, min_rating: min_rating, sort: sorted_values},
    success: function() {
      // Reload the page, triggering the cart_retry loop.
      location.reload(true);
    }
  });
});

function update_preferences_ranking_dropdowns() {
  var sorted_ids = $("#cart_preferences_ranking").sortable("toArray");
  for(var i=0; i<sorted_ids.length; i++) {
    $("#" + sorted_ids[i]).children("select").val(i+1);
  }
}

function update_preferences_ranking_list_order(changed_elem) {
  var li_val = changed_elem.val();
  var li = changed_elem.parent();
  var li_clone = li.clone();
  var ul = li.parent();
  li.remove();
  if(li_val == 1) {
    ul.children("li").first().before(li_clone);
  } else if (li_val == 2) {
    ul.children("li").first().after(li_clone);
  } else {
    ul.children("li").last().after(li_clone);
  }
  li_clone.children("select").change(function(e) {
    update_preferences_ranking_list_order($(this));
    update_preferences_ranking_dropdowns();
  });
}

$("#item_results button").click(function(e) {
  $(this).button('loading');
  $.ajax({
    url: "/cart/item/" + $(this).attr("btnid"),
    type: "PUT",
    data: {quantity: $(this).parent().prev().children("input").val()},
    success: function(){
      window.location.reload(true);
    }
  });
});

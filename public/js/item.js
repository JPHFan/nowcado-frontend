$("#add_item_qty_to_cart").submit(function(e) {
  e.preventDefault();
  var quantity = $("#add_item_qty_to_cart #add_qty").val();
  if (quantity === ""){
    $("#add_item_alert").hide();
    $("#add_item_fail").html("You must specify a quantity!  Cart has not been changed.").show();
  }
  else{
    $("#add_item_fail").hide();
    var item_id = $("#add_item_qty_to_cart #add_item").val();
    $.ajax({
      url:"/cart/item/"+item_id,
      type: "POST",
      data: {quantity: quantity},
      dataType: "json",
      success: function(json){
        if (json.success && json.result !== undefined){
          var plur_text = "There are now ";
          if (quantity <= 1){
            plur_text = "There is now ";
          }
          $("#qty_confirm_text").html(plur_text + json.result[item_id].quantity);
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
    });
  }
});

window.history.replaceState("","",$("#query_string").val());

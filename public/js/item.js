function update_price(item, store) {
  var price = $("input[store_id=" + store + "]").val();
  $.post("/item/" + item + "/price", {
    store_id: store,
    price: price
  }, function(data) {
    if(data.success) {
      $.growl("Item updated",{type:'success',offset:{from:'top',amount:65}});
    } else {
      $.growl(data.message,{type:'error',offset:{from:'top',amount:65}});
    }
  }, 'json');
}

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
    // Bring up existing modal, or simply add to cart if it is empty
    if($("#no_alternatives").length != 0) {
      addToCart([item_id],quantity,true,true,false);
    } else {
      $('#alternatives').modal('show');
    }
  }
});

$("#alternatives_apply").click(function(e) {
  e.preventDefault();
  var quantity = $("#add_item_qty_to_cart #add_qty").val();
  // Find all clicked items, and perform addToCart
  var clicked = [$("#add_item_qty_to_cart #add_item").val()];
  $(".alternative_item").each(function(index, obj) {
    if(obj.style.backgroundColor != "") {
      clicked.push(obj.getAttribute("item_id"));
    }
  });
  addToCart(clicked, quantity,true,true,false);
  $('#alternatives').modal('hide');
})

$(".alternative_item").click(function(e) {
  this.style.backgroundColor=="" ? this.style.backgroundColor="rgb(200,240,255)" : this.style.backgroundColor="";
});

window.history.replaceState("","",$("#query_string").val());

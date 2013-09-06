$("#item_results button").click(function(e) {
  var loc = window.location.href;
  var id = $(this).attr("btnid");
  if (loc.charAt(loc.length-1) != "/") {
    loc += "/";
  }
  var item_ids = $("#item_ids").val().split("/");
  item_ids.splice(item_ids.indexOf(id),1);

  $.post("/set_item/" + item_ids.join("/"), function(){
    window.location = loc.replace("/" + id + "/","/");
  });
});

$("#add_item_qty_to_cart").submit(function(e) {
  e.preventDefault();
  var quantity = $("#add_item_qty_to_cart #add_qty").val();
  if (quantity === ""){
    $("#add_item_alert").hide();
    $("#add_item_fail").html("You must specify a quantity!  Cart has not been changed.").show();
  }
  else{
    $("#add_item_fail").hide();
    $.post("/cart", {quantity: quantity, items: $("#add_item_qty_to_cart #add_items").val()}, function(){
      var plur_text;
      if (quantity <= 1){
        plur_text = "There is now "
      }else{
        plur_text = "There are now "
      }
      $("#qty_confirm_text").html(plur_text + quantity);
      $("#add_item_alert").show();
    });
  }
});

window.history.replaceState("","",$("#query_string").val());

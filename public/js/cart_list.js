var loadedModalIds;
var loadedModalRelIds;
var loadedQty;

$("button.show_alternatives").click(function(e) {
  e.preventDefault();
  var itemIds = this.getAttribute("alt_btnid");

  loadedModalIds = itemIds;
  loadedQty = this.getAttribute("alt_qty");
  loadedModalRelIds = [];
  $("#alternatives_" + itemIds + " div.alternative_item").each(function(index, obj) {
    if(obj.style.backgroundColor!="") {
      loadedModalRelIds.push(obj.getAttribute("item_id"));
    }
  });
  $("#alternatives_" + itemIds).modal('show');
});

$("button[id^='alternativesApply_']").click(function(e) {
  e.preventDefault();
  var quantity = loadedQty;
  // Find all clicked items, and perform addToCart
  var clicked = [loadedModalIds.split(',')[0]];
  $(".alternative_item").each(function(index, obj) {
    if(obj.style.backgroundColor != "") {
      clicked.push(obj.getAttribute("item_id"));
    }
  });
  var preclicked = loadedModalRelIds.slice(0);
  preclicked.unshift(loadedModalIds.split(',')[0]);
  addToCart(preclicked, 0,false,false);
  addToCart(clicked, quantity,false,false);
  $('#alternatives_' + loadedModalIds).modal('hide');
  // Must refresh page now
  window.location.reload(true);
})

$(".alternative_item").click(function(e) {
  this.style.backgroundColor=="" ? this.style.backgroundColor="rgb(200,240,255)" : this.style.backgroundColor="";
});

$("#update_cart").click(function(e) {
  // Update quantities for all items, then refresh page
  $("input[id^='input_qty_']").each(function(index, obj) {
    addToCart(obj.getAttribute("ids"),obj.getAttribute("value"),false,false);
  });
  window.location.reload(true);
});
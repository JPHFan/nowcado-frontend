var item_id = $("#add_item_qty_to_cart #add_item").val();

$("#edit_name_icon,#edit_department_icon,#edit_image_icon").tooltip("hide");

function update_price(item, store) {
  var price = $("input[store_id=" + store + "]").val();
  $.post("/item/" + item + "/price", {
    store_id: store,
    price: price
  }, function(data) {
    if(data.success) {
      $.growl("Item updated",growl_resp.pass);
    } else {
      $.growl(data.message,growl_resp.fail);
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
    // Bring up existing modal, or simply add to cart if it is empty
    if($("#no_alternatives").length != 0) {
      addToCart([item_id],quantity,true,true,false);
    } else {
      $('#alternatives').modal('show');
    }
  }
});

$("#edit_name_form").submit(function(e) {
  e.preventDefault();
  var name = $("#edit_name_input").val();
  if(name === "") {
    $.growl("You must specify a new name. Name has not been changed.",growl_resp.fail);
    return;
  }
  $.post("/item/" + item_id + "/name", {
    name: name
  }, function(data) {
    if(data.success) {
      $.growl("Item updated",growl_resp.pass);
      window.location.reload(true);
    } else {
      $.growl(data.message,growl_resp.fail);
    }
  }, 'json');
});

$("form#newPriceForm").submit(function(e) {
  e.preventDefault();
  $.post("/item", {
    item_name_id: item_id,
    store: JSON.stringify(store),
    price: $("#price").val()
  }, function(data) {
    if (data.success){
      $.growl("Item added", growl_resp.pass);
      var new_store_id = data.result.store_id;
      var close_bracket_idx = window.location.href.indexOf('%5D');
      window.location.href = window.location.href.substring(0, close_bracket_idx) + "%2C" + new_store_id + "%5D";
    } else {
      if(data.message instanceof Object) {
        for (var key in data.message){
          if (typeof data.message[key] == "string"){
            data.message[key] = [data.message[key]]
          }
          for (var i = 0; i < data.message[key].length; i++){
            $.growl(key.charAt(0).toUpperCase() + key.slice(1) + " " + data.message[key][i], growl_resp.fail);
          }
        }
      } else {
        $.growl(data.message, growl_resp.fail);
      }
    }
  }, 'json');
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

$("#add_to_other_store_modal").on("shown", function(){
  google.maps.event.trigger(store_addresspicker_map, "resize");
});

window.history.replaceState("","",$("#query_string").val());

function toggleLoadingButton(a) {
  a.toggleClass('active');
  a.attr('disabled') ? (a.removeAttr('disabled') && addApplyDeptListener()) : a.attr('disabled', 'disabled');
}

function checkDepartmentUploadState(t_id, a) {
  cors_call("/items/dept_transaction/" + t_id,{},function(json) {
    if(json.success) {
      $.growl("Department successfully updated",growl_resp.pass);
      toggleLoadingButton(a);
      window.location.reload(true);
    } else {
      if(json.message == "Still calculating") {
        setTimeout(function(){checkDepartmentUploadState(t_id,a)},500);
      } else {
        toggleLoadingButton(a);
        $.growl(json.message,growl_resp.fail);
      }
    }
  }, "GET");
}

function addApplyDeptListener() {
  $("#apply_edit_department").one("click",function(e) {
    e.preventDefault();
    toggleLoadingButton($(this));
    var $this = $(this);
    // Runs through all steps that have not been completed, and if have not broken at any point, then execute delegated function which does a backend call to update department
    if(-1 == jE.checkValidDepartment(function() {
      if(!confirm("Are you sure you want to update this department?")) {
        toggleLoadingButton($this);
        return;
      }
      // Execute BE call
      $.post("/item/"+item_id+"/department", {
        department: JSON.stringify(jE.jsonObj).replace(/\"/g,""),
        new_dept_attr_paths: JSON.stringify(arr_path_and_vals),
        key_rename_dept_attr_paths: JSON.stringify(arr_path_and_old_val_key),
        rename_dept_attr_paths: JSON.stringify(rename_paths)
      }, function(data) {
        if(data.success) {
          checkDepartmentUploadState(data.result.department_transaction_id, $this);      
        } else {
          toggleLoadingButton($this);
          $.growl(data.message,growl_resp.fail);
        }
      }, 'json');
    })) toggleLoadingButton($this);
  });
}
addApplyDeptListener();

var width = $(window).width();
$("div#item_results_div").width(width-290);
$(window).resize(function() {
  if($(this).width() != width) {
    width = $(this).width();
    $("div#item_results_div").width(width-290);
  }
});
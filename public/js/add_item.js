var add_item_row, all_item_data = {}, dept_histories = {};

// ele refers to the jQuery object corresponding to the name input for a new row
function addTypeahead(ele) {
  ele.typeahead({source: function(query, process) {
    var store_str = "";
    if(store.storeId !== undefined) store_str = "store_ids=" + store.storeId + "&nofilter=true&";
    cors_call("/items?" + store_str + "name=" + query,{},function(json) {
      if(json.success) {
        // merge into all_item_data
        for(var i = 0; i < json.result.length; i++) {
          all_item_data[json.result[i]["name"]] = json.result[i];
        }
        return process(json.result.map(function(o) {return o["name"]}));
      }      
    },"GET");
  }, updater: function(item) {
    // Check whats up with all_item_data[item] and fix up stuff in the ele row
    ele.attr("itemName",ele.val());
    if(all_item_data[item]) {
      var d=all_item_data[item], other_tds = ele.parent().siblings(), price_td = other_tds.first(), barcode_td = other_tds.last();
      if(d["prices"] !== undefined && d["prices"]["1"] !== undefined)
        price_td.children().val(d["prices"]["1"]);
      else
        price_td.children().val("");
      if(d["skus"] !== undefined && d["skus"].length > 0)
        barcode_td.children().val(d["skus"][0]);
      else
        barcode_td.children().val("");
      // Set the onclick for the image button
      $(other_tds[1]).children().attr("onclick","cleanEditImageModal(\"" + (d["img_url"] !== undefined ? d["img_url"] : "")  + "\")");
      // Get history and inject it in to the DOM now
      if(d["id"] !== undefined) {
        cors_call("/items/" + d["id"] + "/history",{},function(json) {
          if(json.success) {
            if(json.result.department.length > 0)
              dept_histories[ele.parent().parent().attr("rowid")] = json.result.department;
            else
              delete dept_histories[ele.parent().parent().attr("rowid")];
          }
        },"GET");
      } 
    } 
    return item;
  }});
}

function cleanEditImageModal(img_url) {
  $("#fileurl").val("");
  if(img_url == null || img_url.trim() == "")
    $("#files").html("");
  else
    $("#files").html("<img src=\"" + domain + img_url + "\" />");
}

function resetAddItemTable() {
  var devModeLock = $(".dev-mode-lock").length != 0;
  all_item_data = {};
  dept_histories = {};
  $("tbody#addItemTableRows").html("<tr rowid=\"1\">" +
            "<td class=\"first\"><input type=\"text\" autocomplete=\"off\" /></td>" +
            "<td><input type=\"number\" min=\"0.00\" step=\"0.01\" class=\"input-mini\" /></td>" +
            "<td><a class=\"btn\" href=\"#edit_image_modal\" role=\"button\" data-toggle=\"modal\" onclick=\"cleanEditImageModal()\">Edit Image</a></td>" +
            "<td " + (devModeLock ? "class=\"dev-mode-lock\"" : "") + "><a class=\"btn\" href=\"#edit_department_modal\" role=\"button\" data-toggle=\"modal\" onclick=\"initDepartmentString(1);\">Edit Dept</a></td>" +
            "<td><input type=\"text\" /></td>" +
          "</tr>");
  addTypeahead($("[rowid=1] input:first"));
}

$("tbody").on("click","tr[rowid]", function(e) {
  // Unhighlight other rows, highlight this one
  if(add_item_row) add_item_row.removeClass("highlighted_row");
  add_item_row = $(this);
  add_item_row.addClass("highlighted_row");
});

$("tbody").on("focus","tr[rowid] td input", function(e) {
  // If this is the last input, render a new row
  var p_tr = $(this).parents("tr"), 
      devModeLock = $(".dev-mode-lock").length != 0,
      next_row = parseInt(p_tr.attr("rowid"))+1;
  if(p_tr.parent().children().last()[0] == p_tr[0]) {
    var insertHtml = "<tr rowid=\"" + next_row + "\">" +
              "<td class=\"first\"><input type=\"text\" autocomplete=\"off\" /></td>" +
              "<td><input type=\"number\" min=\"0.00\" step=\"0.01\" class=\"input-mini\" /></td>" +
              "<td><a class=\"btn\" href=\"#edit_image_modal\" role=\"button\" data-toggle=\"modal\" onclick=\"cleanEditImageModal()\">Edit Image</a></td>" +
              "<td " + (devModeLock ? "class=\"dev-mode-lock\"" : "") + "><a class=\"btn\" href=\"#edit_department_modal\" role=\"button\" data-toggle=\"modal\" onclick=\"initDepartmentString(" + next_row + ");\">Edit Dept</a></td>" +
              "<td><input type=\"text\" /></td>" +
            "</tr>";
    $(insertHtml).insertAfter(p_tr);
    addTypeahead($("[rowid=" + next_row + "] input:first"));
  }
});

$("tbody").on("blur","tr[rowid] td.first input",function(e) {
  if($(this).attr("itemName") != $(this).val()) {
    $(this).attr("itemName",$(this).val());
    // Clear out the barcode
    $(this).parent().siblings("td:last").children("input").val("");
    // Wipe out the img_url and img_url_hash
    $(this).parents("tr").removeAttr("img_url").removeAttr("img_url_hash");
    // Set the image onclick appropriately
    $($(this).parent().siblings("td")[1]).children("a").attr("onclick","cleanEditImageModal();");
  }
});

$("#apply_edit_department").click(function(e) {
  e.preventDefault();
  jE.checkValidDepartment(function() {
    $.growl("Department marked for update",growl_resp.pass);
    $("#edit_department_modal").modal('hide');
    add_item_row.attr("department",JSON.stringify(jE.jsonObj).replace(/\"/g,""));
    add_item_row.attr("new_dept_attr_paths",JSON.stringify(arr_path_and_vals));
    add_item_row.attr("key_rename_dept_attr_paths",JSON.stringify(arr_path_and_old_val_key));
    add_item_row.attr("rename_dept_attr_paths",JSON.stringify(rename_paths));
  });
});

$("button#addItemTableSubmit").click(function(e) {
  e.preventDefault();
  if(!confirm("Are you sure you want to submit this data?")) return;
  var itemsAdded = [], itemsAddedRowMap = [];
  $("tbody#addItemTableRows tr[rowid]").each(function(ind, o) {
    var itemObj = {}, o_children = $(o).children("td"), sku = o_children.last().children("input").val();
    for(var i=0; i < o.attributes.length; i++) {
      if(o.attributes[i].name != "rowid")
        itemObj[o.attributes[i].name] = o.attributes[i].value;
    }    
    itemObj["store"] = JSON.stringify(store);
    itemObj["name"] = $(o_children[0]).children("input").val();
    itemObj["price"] = $(o_children[1]).children("input").val();
    if(sku && sku.trim() != "")
      itemObj["sku"] = sku;
    if(itemObj["name"] && itemObj["name"].trim() != "" && itemObj["price"] && itemObj["price"].trim() != "") {
      itemsAdded.push(itemObj);
      itemsAddedRowMap.push(o.getAttribute("rowid"));
    }
  });
  // TODO perform ajax call using everything in itemsAdded - this is "items" array
  $.post("/items",{items: JSON.stringify(itemsAdded)},function(json) {
    if(json.success) {
      var nullRowIndices = [];
      // Check if entry is null. If so, do not mark for delete.
      // If no entries are null, then notify success, clear table, and redirect to store selection page.
      for(var i = 0; i < json.result.length; i++) {
        
        if(json.result[i] == null) {
          nullRowIndices.push(itemsAddedRowMap[i]);
        } else {
          $("tr[rowid=" + (itemsAddedRowMap[i]) + "]").remove();
        }
      }
      if(nullRowIndices.length == 0) {
        $("#addItemSuccessStatus").removeClass("alert-error").addClass("alert-success").html("Successfully submitted this data.").show();
        $('.carousel').carousel(0);
        resetAddItemTable();
      } else {
        $("#addItemSuccessStatus").removeClass("alert-success").addClass("alert-error").html("These rows did not submit successfully.").show();
      }
    } else {
      alert("There was an error submitting this data.");
    }
  },"json");
});

$(function() {
  addTypeahead($("[rowid] input:first"));
});
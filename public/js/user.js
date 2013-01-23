$("div.thumbnail").click(function(e) {
  e.preventDefault();
  $("#update_memberships_status").hide();
  var checkbox = $(this).children("div").children("input[type='checkbox']");
  checkbox.prop("checked", !checkbox.prop("checked"));
});

$("div.thumbnail div input[type='checkbox']").click(function(e) {
  $("#update_memberships_status").hide();
  e.stopPropagation();
});

$("#update_memberships_button").click(function(e) {
  e.preventDefault();
  var chains = [];
  $("div.thumbnail div input[type='checkbox']").each(function(index) {
    if ($(this).prop("checked")) {
      chains.push(parseInt($(this).next().val()));
    }
  });
  $.post("/set_memberships", {memberships: chains}, function() {
    $("#update_memberships_status").show();
  });
});


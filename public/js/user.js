// $("div.thumbnail").click(function(e) {
//   e.preventDefault();
//   $("#update_memberships_status").hide();
//   var checkbox = $(this).children("div").children("input[type='checkbox']");
//   checkbox.prop("checked", !checkbox.prop("checked"));
// });
//
// $("div.thumbnail div input[type='checkbox']").click(function(e) {
//   $("#update_memberships_status").hide();
//   e.stopPropagation();
// });
//
// $("#update_memberships_button").click(function(e) {
//   e.preventDefault();
//   var chains = [];
//   $("div.thumbnail div input[type='checkbox']").each(function(index) {
//     if ($(this).prop("checked")) {
//       chains.push(parseInt($(this).next().val()));
//     }
//   });
//   $.post("/set_memberships", {memberships: chains}, function() {
//     $("#update_memberships_status").show();
//   });
// });

function getBody(code) {
    return 'I wanted to share my Nowcado invite code with you so you can start saving time and money with me.  Even better, we both get 10 noms when you sign up!%0D%0A%0D%0AMy code is: '+code+'%0D%0A%0D%0ACheck it out at nowcado.com or on the Google Play or Apple App Store!';
}

$("#invite_button").click(function(e) {
  e.preventDefault();
  window.location.href = "mailto:?subject=Nowcado Invitation&body=" + getBody($(this).text());
});

$("#leaderboard_button").click(function(e) {
  e.preventDefault();
  window.location = "/leaderboard";
});

$("#account_back_button").click(function(e) {
  e.preventDefault();
  window.location = "/user";
});

$("div.pagination a").click(function(e) {
  e.preventDefault();
  
  append_query_string($(this).attr("value"),$(this).attr("id"));
  load_query_page();
});

$(document).ready(function(){
  var rank = [
		{
      'headline': 'Rank',
			'value': $("#rank").val(),
			'length': 7,
      'description': 'Your Nowcado Rank'
		}
  ];
  $("#rank_bar").skillset({
		object: rank,
		duration: 40
	});
});

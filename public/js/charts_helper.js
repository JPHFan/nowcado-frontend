function weekendAreas(axes) {
  var markings = [],
  d = new Date(axes.xaxis.min);
  // go to the first Saturday
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
  d.setUTCSeconds(0);
  d.setUTCMinutes(0);
  d.setUTCHours(0);
  var i = d.getTime();
  // when we don't set yaxis, the rectangle automatically
  // extends to infinity upwards and downwards
  do {
    markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
    i += 7 * 24 * 60 * 60 * 1000;
  } while (i < axes.xaxis.max);
  return markings;
}

function show_tooltip(x, y, contents) {
  $('<div id="tooltip">' + contents + '</div>').css( {
    position: 'absolute',
    display: 'none',
    top: y-35,
    left: x+5,
    border: '1px solid #000',
    padding: '2px',
    'background-color': '#011',
    color: '#fff',
    opacity: 0.50,
    'font-size': '8pt',
    'z-index': 5000
  }).appendTo("body").fadeIn(0);
}

function graph_tooltip(div_id, title_function, use_pos) {
  var previousPoint = null;
  $(div_id).on("plothover", function(event, pos, item) {
    if(item) {
      if(previousPoint != item.datapoint) {
        previousPoint = item.datapoint;
        $("#tooltip").remove();
        if(use_pos) {
          show_tooltip(pos.pageX, pos.pageY, title_function(item));
        } else {
          show_tooltip(item.pageX, item.pageY, title_function(item));
        }
      }
    } else {
      $("#tooltip").remove();
      previousPoint = null;
    }
  });
}
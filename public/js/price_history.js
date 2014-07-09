var price_data = {};

// Given each store id, get price histories and render flotchart
var minimap_objs = $(".price_history_minimap");
minimap_objs.each(function(index, obj) {
  var store_id = obj.getAttribute("store");
  var item_id = obj.getAttribute("item");
  $.getJSON("/item/" + item_id + "/price", {
    store_id: store_id
  }, function(data) {
    price_data[[store_id,item_id]] = [];
    var datapoints = data.result;
    for(var i = 0; i < datapoints.length; i++) {
      price_data[[store_id,item_id]].push([new Date(datapoints[i]["time"]) - new Date().getTimezoneOffset()*60000, datapoints[i]["price"]]);
    }
    price_data[[store_id,item_id]].push([new Date() - new Date().getTimezoneOffset()*60000, parseFloat(obj.getAttribute("cur_price"))]);
    // Show mini map for this data
    $.plot(obj, [price_data[[store_id,item_id]]], {
        grid: {
            borderWidth: 0
        },
        series: {
            shadowSize: 0
        },
        yaxis: {
            show: false
        },
        xaxis: {
            show: false
        }
    });
    $(obj).show();
  });
});
minimap_objs.click(function(e) {
  e.preventDefault();
  $("#price_history_detail_modal").modal('show');
  var store_id = this.getAttribute("store");
  var item_id = this.getAttribute("item");
  $("#price_history_detail_modal").on('shown', function() {
    var data = price_data[[store_id,item_id]];
    // Fill out the modal appropriately
    var options = {
      xaxis: {
        mode: "time",
        tickLength: 5
      },
      yaxis: {
        tickDecimals: 2
      },
      selection: {
        mode: "x"
      },
      grid: {
        markings: weekendAreas,
        hoverable: true
      },
      series: {
        lines: {
          show: true
        },
        points: {
          show: true
        }
      },
      legend: {
        show: false
      }
    };
    var plot = $.plot("#price_detail_chart", [data], options);
    graph_tooltip("#price_detail_chart", function(item) {
      return ("$" + item.datapoint[1].toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    }, false);
    var overview = $.plot("#price_detail_chart_overview", [data], {
      series: {
       lines: {
          show: true,
          lineWidth: 1
        },
        shadowSize: 0
      },
      xaxis: {
        ticks: [],
        mode: "time"
      },
      yaxis: {
        ticks: [],
        autoscaleMargin: 0.1
      },
      selection: {
        mode: "x"
      }
    });

    $("#price_detail_chart").on("plotselected", function (event, ranges) {
      // do the zooming
      $.each(plot.getXAxes(), function(_, axis) {
        var opts = axis.options;
        opts.min = ranges.xaxis.from;
        opts.max = ranges.xaxis.to;
      });
      plot.setupGrid();
      plot.draw();
      plot.clearSelection();
      // don't fire event on the overview to prevent eternal loop
      overview.setSelection(ranges, true);
    });
    $("#price_detail_chart_overview").on("plotselected", function (event, ranges) {
      plot.setSelection(ranges);
    });
  });
});
// global variables
var stores = new Array();
var store_markers = new Array();
var stores_map = map_location(0,0, "store_location_search_map", 4);
var store_markers_ids = new Array();

$("#report_type a").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});

$("#reports_content ul.nav a").click(function(e) {
  e.preventDefault();
  // load the report in the pane by parsing the function call based on the report attribute
  eval($(this).attr("report") + "()");
});

// function to update list with relevant markers - only those visible or selected in the list
function update_stores_list() {
  for(var i=0; i < store_markers.length; i++) {
    if(stores_map.getBounds().contains(store_markers[i].getPosition())) {
      // add store_markers[i] to the list if it is not there already
      $("#store_addresses_list button[store_id=" + store_markers_ids[i] + "]").show();
    }
    else {
      // remove it from the list unless it is selected
      var cur_address = $("#store_addresses_list button[store_id=" + store_markers_ids[i] + "]");
      if(!cur_address.hasClass("active")) {
        cur_address.hide();
      }
    }
  }
}

google.maps.event.addListener(stores_map, 'center_changed', function() {update_stores_list()});
google.maps.event.addListener(stores_map, 'zoom_changed', function() {update_stores_list()});

$("#store_preferences_submit").click(function(e) {
  // set stores array here - only set the ones that are both active and visible
  stores = $("#store_addresses_list button:visible.active").map(function() { return window.parseInt(this.getAttribute("store_id")); });
  if(stores.length > 0) {
    $('#store_select').modal('hide');
    $("#stores_selection_status").hide();
  }
});

$("#store_select").on('hide', function(e) {
  // test if we need to prevent hiding the modal
  if(stores.length == 0) {
    // add an error message
    alert_error("#stores_selection_status", "Please select and save the stores you would like to view")
    return e.preventDefault();
  }
}).on('show', function(e) {
  // reset which items are selected in case of changes that were not saved
  for(var i=0; i < store_markers_ids.length; i++) {
    if($.inArray(store_markers_ids[i],stores) == -1) {
      $("#store_addresses_list button[store_id=" + store_markers_ids[i] + "]").removeClass("active");
    } else {
      $("#store_addresses_list button[store_id=" + store_markers_ids[i] + "]").addClass("active").show();
    }
  }
});

// reports
function store_percent_wins() {
  // request the data
  var data = {
    percent_location: 0.20,
    percent_price: 0.38,
    percent_quality: 0.42,
    top_wins_location: {
      1: {
        name: "bread",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "cereal",
        similar: {
          1: {
            name: "milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "milk",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "tomatoes",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "onions",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "eggs",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      }
    },
    top_wins_price: {
      1: {
        name: "milk",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "bread",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "eggs",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "cereal",
        similar: {
          1: {
            name: "milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "tomatoes",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "onions",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      }
    },
    top_wins_quality: {
      1: {
        name: "tomatoes",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "onions",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "milk",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "bread",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "eggs",
        similar: {
          1: {
            name: "cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "cereal",
        similar: {
          1: {
            name: "milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      }
    }
  };
  // display the chart - first inject the relevant divs
  $("#report").html('<div class="row-fluid" style="margin-bottom: 80px;margin-top: 20px;"><div id="pie_chart" class="span6" style="height: 200px;"></div><div id="correlation_chart" class="span6" style="height: 200px;"></div></div><div class="row-fluid"><div id="top_items_list" class="span4"></div><div id="top_similar_items_list" class="span4"></div><div id="top_correlation_list" class="span4"></div></div>');

  // create the pie chart
  $.plot('#pie_chart', [{label: "Location", data: data.percent_location}, {label: "Price", data: data.percent_price}, {label: "Quality",data: data.percent_quality}], {
    series: {
      pie: {
        show: true,
        radius: 1,
        label: {
          show: true,
          radius: 2/3,
          formatter: function(label, series) {
            return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
          },
          background: {
            opacity: 0.8
          }
        }
      }
    },
    legend: {
      show: false
    },
    grid: {
      hoverable: true,
      clickable: true
    }
  });
  $("#pie_chart").on("plotclick",function(event, pos, obj){
    event.preventDefault();
    if(!obj || !obj.series) {
      return;
    }
    var list_data = [];
    var str = "top_wins_quality";
    if(obj.series.label == "Location") {
      str = "top_wins_location";
    } else if(obj.series.label == "Price") {
      str = "top_wins_price";
    }

    $.each(data[str], function(i, v) {
      list_data.push({id: i, val: v.name});
    });
    fill_list("#top_items_list","Top Item Wins (" + obj.series.label + ")",list_data,"#correlation_chart, #top_similar_items_list, #top_correlation_list");

    $("#top_items_list button").click(function(e1) {
      list_data = [];
      var index = window.parseInt($(this).attr("list_item"));
      $.each(data[str][index].similar, function(i, v) {
        list_data.push({id: i, val: v.name});
      });
      fill_list("#top_similar_items_list","Correlated Items",list_data,"#correlation_chart, #top_correlation_list");

      $("#top_similar_items_list button").click(function(e2) {
        var index2 = window.parseInt($(this).attr("list_item"));
        var report_data;
        fill_list("#top_correlation_list","Correlation Reports", [{id: 1, val: "% Correlation"},{id: 2, val: "Estimated Revenue"}],"#correlation_chart");

        $("#top_correlation_list button").click(function(e3) {
          var list_item = window.parseInt($(this).attr("list_item"));
          var correlation_data_src = data[str][index].similar[index2];
          var correlation_data;
          if(list_item == "1") {
            // display % correlation graph
            correlation_data = [{
              label: "Correlation (%)",
              data: [[0.4,correlation_data_src.correlation*100.0]],
              color: "#0ACF00",
              bars: {
                show: true,
                barWidth: 0.2
              }
            }];
            plot_category_bar_chart("#correlation_chart",correlation_data,"percent");
          } else {
            // display est revenue graph
            correlation_data = [{
              label: "Current Correlated Item Monthly Revenue ($)",
              data: [[0.1,correlation_data_src.cur_monthly_rev]],
              color: "#FF5C00",
              bars: {
                show: true,
                barWidth: 0.2
              }
            }, {
              label: "Potential Correlated Item Monthly Revenue ($)",
              data: [[0.4,correlation_data_src.est_monthly_rev]],
              color: "#0A67A3",
              bars: {
                show: true,
                barWidth: 0.2
              }
            }, {
             label: "Potential Correlated Item Monthly Revenue Increase ($)",
              data: [[0.7,correlation_data_src.est_monthly_savings]],
              color: "#0ACF00",
              bars: {
                show: true,
                barWidth: 0.2
              }
            }];
            plot_category_bar_chart("#correlation_chart",correlation_data,"currency");
          }

        });
        $('#top_correlation_list button[list_item="1"]').click();
      });
      $('#top_similar_items_list button[list_item="1"]').click();
    });
    $('#top_items_list button[list_item="1"]').click();
  });
  // fake a click to fill the page
  $("#pie_chart").trigger("plotclick",[0, {series: {label: "Price"}}]);
}

// report helper functions
// data is an array of identifiers and string values
// id will take the form of the identifier + the integer offset in the list
function fill_list(div_id, label, data, clear_id) {
  var html = '<span class="label" style="margin-left: 4px;">' + label + '</span><div class="btn-group btn-group-vertical span12" data-toggle="buttons-radio">';
  for(i=0; i<data.length;i++) {
    html += '<button type="button" class="btn span12" style="text-align: left;" list_item="' + data[i].id + '">' + data[i].id + ": " + data[i].val + '</button>';
  }
  html += '</div>';
  $(div_id).html(html);
  $(clear_id + ",#tooltip").html("");
}

// type corresponds to what should be displayed for the hovered item. options include percent and currency.
function plot_category_bar_chart(div_id, data, type) {
  $.plot(div_id, data, {
    legend: {
      labelBoxBorderColor: "none",
        position: "right"
    },
    series: {
      shadowSize: 1
    },
    xaxis: {
      min: 0,
      max: 1,
      ticks: 0,
      show: false
    },
    grid: {
      hoverable: true
    }
  });
  var previousPoint = null;
  $(div_id).on("plothover", function(event, pos, item) {
    if(item) {
      if(previousPoint != item.datapoint) {
        previousPoint = item.datapoint;
        $("#tooltip").remove();
        var x = item.datapoint[0],
            y = item.datapoint[1] - item.datapoint[2],
            title = "$" + y.toFixed(2);

        if(type == "percent") {
          title = y.toFixed(2) + "%"
        }
        showToolTip(item.pageX, item.pageY, title);
      }
    } else {
      $("#tooltip").remove();
      previousPoint = null;
    }
  });
}

function showToolTip(x, y, contents) {
  $('<div id="tooltip">' + contents + '</div>').css( {
    position: 'absolute',
    display: 'none',
    top: y-35,
    left: x+5,
    border: '1px solid #fdd',
    padding: '2px',
    'background-color': '#fee',
    opacity: 0.80,
    'font-size': '8pt'
  }).appendTo("body").fadeIn(0);
}
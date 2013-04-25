// global variables
var stores = new Array();
var store_markers = new Array();
var stores_map = map_location(0,0, "store_location_search_map", 4);
var store_markers_ids = new Array();
var rt_update;
var cur_report = null;

$("#report_type a").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});

$("#store_reports ul.nav a").click(function(e) {
  e.preventDefault();
  // load the report in the pane by parsing the function call based on the report attribute
  // first clear the rt_update to prevent constant loading
  clearInterval(rt_update);
  // set the cur_report, then make the function call
  if(!($(this).attr("report") === undefined)) {
    cur_report = $(this);
  }
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
  stores = $.makeArray($("#store_addresses_list button:visible.active").map(function() { return window.parseInt(this.getAttribute("store_id")); }));
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
  // fake a click to the current report, or first report if we have not yet set the current report
  //   or if the report is not a store report
  if(cur_report == null || cur_report.parents('#store_reports').length < 1) {
    $("#store_reports ul.nav a:first").click();
  } else {
    cur_report.click();
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
    top_wins_location: {
      1: {
        name: "Bread",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "Cereal",
        similar: {
          1: {
            name: "Milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "Milk",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "Tomatoes",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Onions",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "Eggs",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
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
        name: "Milk",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "Bread",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "Eggs",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "Cereal",
        similar: {
          1: {
            name: "Milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "Tomatoes",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Onions",
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
        name: "Tomatoes",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Onions",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      2: {
        name: "Milk",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      3: {
        name: "Bread",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      4: {
        name: "Eggs",
        similar: {
          1: {
            name: "Cereal",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          }
        }
      },
      5: {
        name: "Cereal",
        similar: {
          1: {
            name: "Milk",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          2: {
            name: "Eggs",
            correlation: 0.73,
            cur_monthly_rev: 102.34,
            est_monthly_rev: 987.36,
            est_monthly_savings: 885.02
          },
          3: {
            name: "Tomatoes",
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
  $("#report").html(
    '<div class="row-fluid" style="margin-bottom: 80px;margin-top: 20px;">' +
      '<div id="pie_chart" class="span6" style="height: 200px;"></div>' +
      '<div id="correlation_chart" class="span6" style="height: 200px;"></div>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="top_items_list" class="span4"></div>' +
      '<div id="top_similar_items_list" class="span4"></div>' +
      '<div id="top_correlation_list" class="span4"></div>' +
    '</div>');

  load_report_data("/reports/wins", { store_ids: stores }, function(json) {
    var results = json.result;
    if (results.win_count != 0)
    {
      data.percent_location = results.dist_win_cnt / results.win_count;
      data.percent_location_percent_loyal = results.dist_win_loyal_cnt / results.dist_win_cnt;
      data.percent_price = results.price_win_cnt / results.win_count;
      data.percent_price_percent_loyal = results.price_win_loyal_cnt / results.price_win_cnt;
      data.percent_quality = results.qual_win_cnt / results.win_count;
      data.percent_quality_percent_loyal = results.qual_win_loyal_cnt / results.qual_win_cnt;
      // create the pie chart
      plot_pie_chart('#pie_chart',
        [{label: "Location", data: data.percent_location}, {label: "Price", data: data.percent_price}, {label: "Quality",data: data.percent_quality}],
        {hoverable: true, clickable: true});

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
                plot_category_bar_chart("#correlation_chart",correlation_data,"percent", 1);
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
                plot_category_bar_chart("#correlation_chart",correlation_data,"currency", 1);
              }

            });
            $('#top_correlation_list button[list_item="1"]').click();
          });
          $('#top_similar_items_list button[list_item="1"]').click();
        });
        $('#top_items_list button[list_item="1"]').click();
      });

      graph_tooltip("#pie_chart", function(item) {
        if(item) {
          if(item.series.label == "Quality") {
            return (data.percent_quality_percent_loyal*100).toFixed(2) + "% of these are loyal customers";
          } else if (item.series.label == "Price") {
            return (data.percent_price_percent_loyal*100).toFixed(2) + "% of these are loyal customers";
          } else {
            return (data.percent_location_percent_loyal*100).toFixed(2) + "% of these are loyal customers";
          }
        }
      }, true);
      // fake a click to fill the page
      $("#pie_chart").trigger("plotclick",[0, {series: {label: "Price"}}]);
    }
    else
    {
      $("#report").html('<div class="row-fluid" style="margin-bottom: 80px;margin-top: 20px;"><span>These stores have no wins.</span></div>');
    }
  });
}

function store_loyalty() {
  var data = {};
  var c_d = [];

  load_report_data("/reports/wins", { store_ids: stores }, function(json) {
    var results = json.result;
    $("#report").html(
        '<div class="row-fluid">' +
          '<div class="span6" style="margin-bottom: 10px;">' +
            '<span id="explanation_span"></span>' +
          '</div>' +
          '<div class="span6" style="margin-bottom: 10px; margin-top: 10px;">' +
            '<span>This is how customers perceive your store over time. 100% represents an ideal rating.</span>' +
          '</div>' +
        '</div>' +
        '<div class="row-fluid">' +
          '<div id="pie_chart" class="span6" style="height: 200px;"></div>' +
          '<div id="line_chart" class="span6" style="height: 200px;"></div>' +
        '</div>' +
        '<div class="row-fluid">' +
          '<div id="overview" class="span6 offset6" style="height: 100px;"></div>' +
        '</div>');

    if (results.win_count != 0)
    {
      var total_loyal_wins = (results.dist_win_loyal_cnt + results.price_win_loyal_cnt + results.qual_win_loyal_cnt);
      data.percent_loyal_wins = total_loyal_wins / results.win_count;

      $("#explanation_span").html(
        '<h3 style="color: green;display: inline;">' + (data.percent_loyal_wins*100).toFixed(2) + '%</h3>' +
        ' of your wins are to loyal members. Of these, wins are broken down as follows: ');

      if (total_loyal_wins != 0)
      {
        data.percent_loyal_wins_percent_location = results.dist_win_loyal_cnt / total_loyal_wins;
        data.percent_loyal_wins_percent_price = results.price_win_loyal_cnt / total_loyal_wins;
        data.percent_loyal_wins_percent_quality = results.qual_win_loyal_cnt / total_loyal_wins;
        // plot the pie chart
        plot_pie_chart('#pie_chart',
          [{label: "Location", data: data.percent_loyal_wins_percent_location}, {label: "Price", data: data.percent_loyal_wins_percent_price}, {label: "Quality",data: data.percent_loyal_wins_percent_quality}],
          {hoverable: false, clickable: false});
      }
    }
    else
    {
      $("#explanation_span").html('These stores have no wins.');
    }
    // Can handle plotting multiple stores at once, with their data aggregated into one line chart.
    load_report_data("/reports/loyalty", { store_ids: stores }, function(json) {
      // Receive data as array of [unix_time, (average rating / max_rating)]
      c_d = json.result;

      // convert percentages
      for(var i=0; i < c_d.length; i++) {
        c_d[i][1] *= 100;
      }

      var options = {
        xaxis: {
          mode: "time",
          tickLength: 5
        },
        yaxis: {
          min: 0.0,
          max: 100.0
        },
        selection: {
          mode: "x"
        },
        grid: {
          markings: weekend_areas,
          hoverable: true
        },
        series: {
          lines: {
            show: true
          },
          points: {
            show: true
          },
          color: "#0ACF00"
        }
      };

      // plot the line chart
      var plot = $.plot('#line_chart',[c_d],options);

      // add tooltip functionality to the line chart
      graph_tooltip("#line_chart", function(item) {
        return (item.datapoint[1].toFixed(2) + "%");
      }, false);

      // plot the overview
      var overview = $.plot("#overview",[c_d], {
        series: {
          lines: {
            show: true,
            lineWidth: 1
          },
          shadowSize: 0,
          label: "Overall customer perception over time (%)",
          color: "#0ACF00"
        },
        xaxis: {
          ticks: [],
          mode: "time"
        },
        yaxis: {
          ticks: [],
          min: 0,
          autoscaleMargin: 0.1
        },
        selection: {
          mode: "x"
        },
        legend: {
          labelBoxBorderColor: "none",
            position: "right"
        }
      });

      // connect the two graphs
      $("#line_chart").on("plotselected", function(event, ranges) {
        plot = $.plot("#line_chart", [c_d], $.extend(true, {}, options, {
          xaxis: {
            min: ranges.xaxis.from,
            max: ranges.xaxis.to
          }
        }));
        overview.setSelection(ranges, true);
      });
      $("#overview").on("plotselected", function(event, ranges) {
        plot.setSelection(ranges);
      })
    });
  });
}

function store_rt_inv() {
  var items_hash = {},
      series_names = {},
      data = {};
  $("#report").html(
    '<div class="row-fluid input-append">' +
      '<select id="rt_item_store_select" class="span3"></select>' +
      '<input type="text" id="store_item_search" placeholder="Search for items in your store(s)" class="span7">' +
      '<button type="button" class="btn btn-primary" id="add_to_report">Add To Report</button>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="line_chart" style="height: 300px;margin-top: 10px; margin-bottom: 20px;"></div>' +
    '</div>' +
    '<div class="row-fluid" id="line_chart_legend"></div>' +
    '<div class="row-fluid">' +
      '<table class="table table-bordered">' +
        '<thead><tr><th>Store</th><th>Item</th><th>Remove</th></tr></thead>' +
        '<tbody id="table_series"></tbody>' +
      '</table>' +
    '</div>');
  $("#store_item_search").typeahead({
    source: function(query, process) {
      load_report_data(domain + "/items?callback=?", { store_ids: stores, name: query }, function(json) {
        // we get results in the form {item_name => {store_id => item_id}}
        items_hash = json.result;
        return process(Object.keys(items_hash));
      });
    }
  });

  var h = '<option>All Stores</option>';
  for(var i=0; i<stores.length; i++) {
    h += '<option>' + $("#store_addresses_list button[store_id=" + stores[i] + "]").html() + '</option>';
  }
  $("#rt_item_store_select").html(h);

  $("table.table").tablesorter({ headers: {2: {sorter: false}}});

  // when adding an item to the series, include the selected element's related data
  $("#add_to_report").click(function(e) {
    var selection = $("#store_item_search").val();
    var selected_store = $("#rt_item_store_select option:selected").html();
    // loop through all stores for the selected item
    for(var store_id in items_hash[selection]) {
      // get  the store_id and item_id
      var item_id = items_hash[selection][store_id]
      // inject the series' by building up the html
      h = '<tr><td>';
      // get the store name from the store_id
      var store_name = $("#store_addresses_list button[store_id=" + store_id + "]").html();
      h += store_name;
      // get the item name and put in the remove button with a corresponding item id
      h += '</td><td>' + selection + '</td><td><button class="btn btn-mini btn-danger" item_id=' + item_id + '>Remove</button></td></tr>';

      // insert the selected element as a row in to the table only if the element was not already inserted and matches with the store selection
      if( ($("#table_series button[item_id=" + item_id + "]").length == 0) &&
          (selected_store == store_name || selected_store == "All Stores") ) {
        $("#table_series").append(h);
        // update sorter
        $("table.table").trigger("update");
        // attach a handler for the remove button
        $("#table_series button[item_id=" + item_id + "]").click(function(e) {
          // remove row and series name entry and update sorter
          item_id = $(this).attr("item_id");
          delete series_names[item_id];
          delete data[item_id];
          $(this).parent().parent().remove();
          $("table.table").trigger("update");
        });
        // add the item
        series_names[item_id] = store_name + ':' + selection;
        data[item_id] = [];
      }
    }
  });

  // update graph data every update_interval ms and use max_points per series on the graph
  var max_points = 600;
  var update_interval = 500;
  rt_update = setInterval(function() {
    // get the latest data and pass it in to the graph
    $.getJSON(domain + "/items?callback=?", { item_ids: Object.keys(series_names), qty_only: true }, function(json) {
      // loop through each series
      for(var k in data) {
        // delete the first point if we have too many points
        if(data[k].length >= max_points)
          data[k] = data[k].slice(1);
      }
      var current_time = new Date().getTime() - new Date().getTimezoneOffset()*60000;
      for(var i=0; i<json.result.length; i++) {
        // push the [current_time, value] on data array
        data[json.result[i][0]].push([current_time,json.result[i][1]]);
      }
      // zip up the results
      var res = [];
      for(var k in series_names) {
        res.push({label: series_names[k], data: data[k]})
      }

      $.plot("#line_chart",res,{
        series: {
          shadowSize: 0
        },
        xaxis: {
          show: true,
          mode: "time"
        },
        legend: {
          show: true,
          container: $("#line_chart_legend")
        }
      });
    });
  },update_interval);
}

function store_dept_rev() {
  //TODO create data with a load_report_data call - this will only be daily data
  var data = [],
      // Note that depts is a temporary variable used for fake data creation - this variable will not be needed
      depts = ["Alcohol", "Baby", "Bakery", "Baking", "Beverages", "Breakfast", "Canned goods", "Condiments", "Dairy",
               "Deli", "Ethnic", "Floral", "Frozen", "Grains & pasta", "Health & beauty", "Household & cleaning",
               "Meat & seafood", "Pet care", "Produce", "Sauces & spices", "Snacks"];
  for(var i in stores) {
    for(var j in depts) {
      var temp = [];
      for(var index = 0; index < 395; index++) {
        temp.push([Date.UTC(2012,2,26,0,0,0)+86400000*index,parseFloat((Math.random()*300).toFixed(2))])
      }
      data.push({
        label: $("#store_addresses_list button[store_id=" + stores[i] + "]").html() + ":" + depts[j],
        data: temp
      })
    }
  }

  // detect departments
  //  labels will be in the form "store_name:department_name"
  //  departments hash will store which departments are currently selected as a boolean
  var departments = {},
      department_dropdown_string = '';
  for(var x in data) {
    departments[data[x].label.substring(data[x].label.indexOf(":")+1)] = false;
  }
  for(var k in departments) {
    department_dropdown_string += '<div class="btn-group" data-toggle="buttons-checkbox" style="margin-bottom: 3px; margin-left: 0px; margin-right: 5px">' +
        '<button type="button" class="btn btn-mini" style="padding: 0;">' + k + '</button>' +
        '</div>';
  }

  $("#report").html(
    '<div class="row-fluid">' +
          department_dropdown_string +
    '</div>' +
    '<div class="row-fluid" style="margin-bottom: 20px;">' +
      '<button type="button" class="btn btn-primary" id="agg_stores">Aggregate all stores</button>' +
      '<span id="granularity_span" style="margin-left: 20px;"></span>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="line_chart" style="height: 300px;" class="span12"></div>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="overview" class="span12" style="height: 100px;"></div>' +
    '</div>'
  );

  // convert all time values from UTC to local time and find the range
  var max_x_val = 0,
      min_x_val = data[0].data[0][0];
  for(var x in data) {
    for(var y in data[x].data) {
      data[x].data[y][0] -= new Date().getTimezoneOffset()*60000;
      if(data[x].data[y][0] > max_x_val) {
        max_x_val = data[x].data[y][0];
      } else if(data[x].data[y][0] < min_x_val) {
        min_x_val = data[x].data[y][0];
      }
    }
  }
  var range = max_x_val - min_x_val,
      temp_data = zoom_calc_datapoints(range, data,true,departments),
      s_ranges;

  var options = {
    xaxis: {
      mode: "time",
      tickLength: 5
    },
    selection: {
      mode: "x"
    },
    grid: {
      markings: weekend_areas,
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
  }, options_overview = {
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
    },
    legend: {
      position: "right"
    }
  };

  // plot the line chart
  var plot = $.plot('#line_chart',temp_data,options);

  // add tooltip functionality to the line chart
  graph_tooltip("#line_chart", function(item) {
    return ("$" + item.datapoint[1].toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
  }, false);
   // plot the overview
  var overview = $.plot("#overview",zoom_calc_datapoints(31536000001,data,false,departments), options_overview);

  // connect the two graphs
  $("#line_chart").on("plotselected", function(event, ranges) {
    min_x_val = ranges.xaxis.from;
    max_x_val = ranges.xaxis.to;
    range = ranges.xaxis.to - ranges.xaxis.from;
    s_ranges = ranges;
    plot = $.plot("#line_chart", zoom_calc_datapoints(range, data,true,departments), $.extend(true, {}, options, {
      xaxis: {
        min: ranges.xaxis.from,
        max: ranges.xaxis.to
      }
    }));
    overview.setSelection(ranges, true);
  });
  $("#overview").on("plotselected", function(event, ranges) {
    range = ranges.xaxis.to - ranges.xaxis.from;
    min_x_val = ranges.xaxis.from;
    max_x_val = ranges.xaxis.to;
    s_ranges = ranges;
    plot.setSelection(ranges);
  });

  $("#agg_stores").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("active");
    temp_data = zoom_calc_datapoints(range, data,true,departments);
    plot = $.plot('#line_chart',temp_data,$.extend(true, {}, options, {
      xaxis: {
        min: min_x_val,
        max: max_x_val
      }
    }));
    overview = $.plot("#overview",zoom_calc_datapoints(31536000001,data,false,departments), options_overview);
    if(!(s_ranges === undefined)) {
      overview.setSelection(s_ranges, true);
    }
  });

  $("div.row-fluid div.btn-group button").click(function(e) {
    if($(this).hasClass("active")) {
      departments[$(this).text()] = false;
    } else {
      departments[$(this).text()] = true;
    }
    temp_data = zoom_calc_datapoints(range, data,true,departments);
    plot = $.plot('#line_chart',temp_data,$.extend(true, {}, options, {
      xaxis: {
        min: min_x_val,
        max: max_x_val
      }
    }));
    overview = $.plot("#overview",zoom_calc_datapoints(31536000001,data,false,departments), options_overview);
    if(!(s_ranges === undefined)) {
      overview.setSelection(s_ranges, true);
    }
  });

  // fake click to the first department listed
  $("div.row-fluid div.btn-group button:first").click();
}

function store_similar_items() {
  // establish the url format for the store-specific form
  var items_hash = {};
  $("#report").html(
    '<div class="row-fluid input-append">' +
      '<input type="text" id="item_search" placeholder="Search for first item" class="span8">' +
      '<button type="button" class="btn btn-primary" id="set_first_item">Set Item</button>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<table class="table table-bordered table-hover table-condensed" style="max-height: 300px;" id="similar_items_table">' +
        '<thead><tr><th>Other Item</th><th>Location</th><th>Confidence</th></tr></thead>' +
        '<tbody></tbody>' +
      '</table>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<span id="recommendation_text"></span>' +
    '</div>');
  $("#item_search").typeahead({
    source: function(query, process) {
      load_report_data(domain + "/items?callback=?", {name: query, store_ids: stores}, function(json) {
        // we get results in the form {item_name => {store_id => item_id}}
        items_hash = json.result;
        return process(Object.keys(items_hash));
      });
    }
  });
  $("#set_first_item").click(function(e) {
    var first_item = $("#item_search").val();
    var item_ids = [];
    for(var k in items_hash[first_item]) {
      item_ids.push(items_hash[first_item][k]);
    }
    if(item_ids.length == 0) { return; }
    // set up the table with the appropriate data
//TODO    load_report_data(domain + "/items/similar?callback=?", { store_ids: stores, item_ids: item_ids }, function(json) {
      // set up table rows from json.result
      var data = [
          {item: "Apple", location: "Near", correlation: 0.92},
          {item: "Milk", location: "Far", correlation: 0.89},
          {item: "Tomato", location: "Near", correlation: 0.85},
          {item: "Rice", location: "Far", correlation: 0.82},
          {item: "Flour", location: "Far", correlation: 0.80}
      ];
      var h = '';
      for(var i=0; i<data.length; i++) {
        h += '<tr><td>' + data[i].item + '</td><td>' + data[i].location + '</td><td>' + data[i].correlation*100 + '%</td></tr>';
      }
      $("#similar_items_table tbody").html(h);
      $("#similar_items_table").tablesorter();
      // add listener for table click event to display the explanation
      $("#similar_items_table tr:gt(0)").click(function(e) {
        var text = 'We are <b style="color: green">' + $(this).children("td:last").html() + '</b> confident that you should place ' +
            first_item + ' and ' + $(this).children("td:first").html();
        if($(this).children("td:nth-child(2)").html() == "Near") {
          text += ' <b style="color: green;">close together.</b>'
        } else {
          text += ' <b style="color: red;">far apart.</b>'
        }
        $("#recommendation_text").html(text);
      });
//TODO    });
  });
}

function store_sales_history() {
  //TODO create data with a load_report_data call
  var data = [];
  for(var i in stores) {
    var temp = [];
    for(var index = 0; index < 9500; index++) {
      temp.push([Date.UTC(2012,2,26,8,0,0)+3600000*index,parseFloat((Math.random()*5000).toFixed(2))])
    }
    data.push({
      label: $("#store_addresses_list button[store_id=" + stores[i] + "]").html(),
      data: temp
    })
  }

  $("#report").html(
    '<div class="row-fluid" style="margin-bottom: 20px;">' +
      '<button type="button" class="btn btn-primary" id="agg_stores">Aggregate all stores</button>' +
      '<span id="granularity_span" style="margin-left: 20px;"></span>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="line_chart" style="height: 300px;" class="span12"></div>' +
    '</div>' +
    '<div class="row-fluid">' +
      '<div id="overview" class="span12" style="height: 100px;"></div>' +
    '</div>'
  );

  // convert all time values from UTC to local time and find the range
  var max_x_val = 0,
      min_x_val = data[0].data[0][0];
  for(var x in data) {
    for(var y in data[x].data) {
      data[x].data[y][0] -= new Date().getTimezoneOffset()*60000;
      if(data[x].data[y][0] > max_x_val) {
        max_x_val = data[x].data[y][0];
      } else if(data[x].data[y][0] < min_x_val) {
        min_x_val = data[x].data[y][0];
      }
    }
  }
  var range = max_x_val - min_x_val,
      temp_data = zoom_calc_datapoints(range, data,true),
      s_ranges;

  var options = {
    xaxis: {
      mode: "time",
      tickLength: 5
    },
    selection: {
      mode: "x"
    },
    grid: {
      markings: weekend_areas,
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
  }, options_overview = {
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
    },
    legend: {
      position: "right"
    }
  };

  // plot the line chart
  var plot = $.plot('#line_chart',temp_data,options);

  // add tooltip functionality to the line chart
  graph_tooltip("#line_chart", function(item) {
    return ("$" + item.datapoint[1].toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
  }, false);
   // plot the overview
  var overview = $.plot("#overview",zoom_calc_datapoints(31536000001,data,false), options_overview);

  // connect the two graphs
  $("#line_chart").on("plotselected", function(event, ranges) {
    min_x_val = ranges.xaxis.from;
    max_x_val = ranges.xaxis.to;
    range = ranges.xaxis.to - ranges.xaxis.from;
    s_ranges = ranges;
    plot = $.plot("#line_chart", zoom_calc_datapoints(range, data,true), $.extend(true, {}, options, {
      xaxis: {
        min: ranges.xaxis.from,
        max: ranges.xaxis.to
      }
    }));
    overview.setSelection(ranges, true);
  });
  $("#overview").on("plotselected", function(event, ranges) {
    range = ranges.xaxis.to - ranges.xaxis.from;
    min_x_val = ranges.xaxis.from;
    max_x_val = ranges.xaxis.to;
    s_ranges = ranges;
    plot.setSelection(ranges);
  });

  $("#agg_stores").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("active");
    temp_data = zoom_calc_datapoints(range, data,true);
    plot = $.plot('#line_chart',temp_data,$.extend(true, {}, options, {
      xaxis: {
        min: min_x_val,
        max: max_x_val
      }
    }));
    overview = $.plot("#overview",zoom_calc_datapoints(31536000001,data,false), options_overview);
    if(!(s_ranges === undefined)) {
      overview.setSelection(s_ranges, true);
    }
  });

}

function zoom_calc_datapoints(range, data, update_text, departments) {
  var temp_data = [],
      d_c = $.extend(true, {}, data);
  // remove any unselected departments
  if(!(departments === undefined)) {
    for(var x in d_c) {
      if(departments[d_c[x].label.substring(d_c[x].label.indexOf(":")+1)] == false) {
        delete d_c[x];
      }
    }
  }

  if(range > 31536000000) {
    // when the range is greater than 1 year, use monthly aggregates
    if(update_text) {
      $("#granularity_span").html('Currently viewing <i><b>monthly</b></i> aggregates');
    }
    for(var x in d_c) {
      var temp_hash = {},
          temp_arr = [];
      for(var y in d_c[x].data) {
        var time = new Date(d_c[x].data[y][0]),
            date = Date.UTC(time.getFullYear(),time.getMonth(),1,0,0,0);
        if(temp_hash[date] === undefined) {
          temp_hash[date] = d_c[x].data[y][1];
        } else {
          temp_hash[date] += d_c[x].data[y][1];
        }
      }
      for(var k in temp_hash) {
        temp_arr.push([k,temp_hash[k]]);
      }
      temp_data.push({
        label: d_c[x].label,
        data: temp_arr
      });
    }
  } else if(range > 604800000 || !(departments === undefined)) {
    // when the range is greater than 1 week, use daily aggregates
    if(update_text) {
      $("#granularity_span").html('Currently viewing <i><b>daily</b></i> aggregates');
    }
    for(var x in d_c) {
      var temp_hash = {},
          temp_arr = [];
      for(var y in d_c[x].data) {
        var time = new Date(d_c[x].data[y][0]),
            date = Date.UTC(time.getFullYear(),time.getMonth(),time.getDate(),0,0,0);
        if(temp_hash[date] === undefined) {
          temp_hash[date] = d_c[x].data[y][1];
        } else {
          temp_hash[date] += d_c[x].data[y][1];
        }
      }
      for(var k in temp_hash) {
        temp_arr.push([k,temp_hash[k]]);
      }
      temp_data.push({
        label: data[x].label,
        data: temp_arr
      });
    }
  } else {
    if(update_text) {
      $("#granularity_span").html('Currently viewing <i><b>hourly</b></i> aggregates');
    }
    for(var x in d_c) {
      temp_data.push(d_c[x]);
    }
  }
  // check if aggregating all stores together
  if($("#agg_stores").hasClass("active")) {
    if(update_text) {
      $("#granularity_span").append(' across all stores.');
    }
    var temp_hash = {},
        temp_arr = [];
    if(departments === undefined) {
      for(var x in temp_data) {
        for(var y in temp_data[x].data) {
          var date = temp_data[x].data[y][0];
          if(temp_hash[date] === undefined) {
            temp_hash[date] = temp_data[x].data[y][1];
          } else {
            temp_hash[date] += temp_data[x].data[y][1];
          }
        }
      }
      for(var k in temp_hash) {
        temp_arr.push([k,temp_hash[k]]);
      }
      temp_data = [{
        label: "All Selected Stores",
        data: temp_arr
      }];
    } else {
      for(var x in temp_data) {
        for(var y in temp_data[x].data) {
          var department = temp_data[x].label.substring(temp_data[x].label.indexOf(":")+1),
              date = temp_data[x].data[y][0];
          if(temp_hash[department] === undefined) {
            temp_hash[department] = {};
            temp_hash[department][date] = temp_data[x].data[y][1];
          } else {
            if(temp_hash[department][date] === undefined) {
              temp_hash[department][date] = temp_data[x].data[y][1];
            } else {
              temp_hash[department][date] += temp_data[x].data[y][1];
            }
          }
        }
      }
      temp_data = [];
      for(var i in temp_hash) {
        temp_arr = [];
        for(var j in temp_hash[i]) {
          temp_arr.push([j,temp_hash[i][j]]);
        }
        temp_data.push({
          label: "All Selected Stores:" + i,
          data: temp_arr
        });
      }
    }
  } else {
    if(update_text) {
      $("#granularity_span").append(' per store.');
    }
  }
  return temp_data;
}

function store_purchase_times() {
  $("#report").html(
    '<div class="row-fluid">' +
      '<div class="btn-group" data-toggle="buttons-radio">' +
        '<button type="button" class="btn active" time="hour">By Hour</button>' +
        '<button type="button" class="btn" time="day">By Day</button>' +
        '<button type="button" class="btn" time="week">By Week</button>' +
        '<button type="button" class="btn" time="month">By Month</button>' +
      '</div>' +
    '</div>' +
    '<div class="row-fluid" id="charts" style="display: none">' +
      '<div class="span6">' +
        '<h5>% Sales Per Time Period</h5>' +
        '<div id="percent_sales_chart" style="height: 300px"></div>' +
      '</div>' +
      '<div class="span6">' +
        '<h5>Average Revenue Per Time Period</h5>' +
        '<div id="revenue_chart" style="height: 300px"></div>' +
      '</div>' +
    '</div>');

  $("div.row-fluid div.btn-group button").click(function(e) {
    // TODO replace data with load_report_data
    //   The code below currently detects which time option was selected (e.g. hour of the day, day of week, week in month, or month of year)
    //   This should be part of the parameters passed in to the backend query.

    // detect which time period was selected
    var time = $(this).attr("time"),
        data;
    if(time == "hour") {
      // Note here that not all hours are included. If there is no data for an hour, it is simply unlisted here.
      // Also note that the request to the backend must take in to account the current user's UTC offset so that the results are localized properly.
      // This data represents the average revenue earned for each hour of the day for the stores selected
      data = {
        "6 AM": 400,
        "7 AM": 800,
        "8 AM": 2000,
        "9 AM": 5200,
        "10 AM": 2000,
        "11 AM": 1600,
        "12 PM": 5200,
        "1 PM": 3200,
        "2 PM": 400,
        "3 PM": 400,
        "4 PM": 400,
        "5 PM": 1600,
        "6 PM": 4000,
        "7 PM": 6000,
        "8 PM": 4800,
        "9 PM": 2000
      };
    } else if(time == "day") {
      data = {
        "Sunday": 41000,
        "Monday": 23000,
        "Tuesday": 19000,
        "Wednesday": 22000,
        "Thursday": 24000,
        "Friday": 27000,
        "Saturday": 38000
      };
    } else if(time == "week") {
      data = {
        "1st week": 140000,
        "2nd week": 220000,
        "3rd week": 210000,
        "4th week": 200000,
        "5th week": 100000,
        "6th week": 30000
      };
    } else {
      data = {
        "January": 700000,
        "February": 750000,
        "March": 800000,
        "April": 850000,
        "May": 900000,
        "June": 1000000,
        "July": 850000,
        "August": 800000,
        "September": 700000,
        "October": 800000,
        "November": 900000,
        "December": 950000
      };
    }

    $("#charts").show();

    // calculate percentages and convert in to plot-compliant format
    var pie_data = [],
        bar_data = [],
        pie_sum = 0,
        i = 0,
        length = 0;
    for(var k in data) {
      pie_sum += data[k];
      length++;
    }
    for(var k in data) {
      pie_data.push({label: k, data: data[k] / pie_sum});
      bar_data.push({label: k, data: [[(i++)/length,data[k]]], bars: {show: true, barWidth: 1 / (length * 2)} });
    }
    // plot the pie and bar charts
    plot_pie_chart('#percent_sales_chart', pie_data, {hoverable: false, clickable: false});
    plot_category_bar_chart("#revenue_chart",bar_data,"currency", Math.floor(length / 3));
  });
  // fake the first click
  $("div.row-fluid div.btn-group button:first").click();
}

function store_top_sellers() {
  //TODO get the actual relevant item_ids and sold_items, based on last week's and month's values
  var weekly_sold = { 161:10, 30:8, 481:7, 541:7, 921:6, 1141:6, 1181:5, 1541:5},
      monthly_sold = { 1960:35, 2080:25, 2440:22, 2580:18, 2760:16, 2900:15, 3200:14, 3440:12},
      html = "",
      items_hash = {};

  load_report_data(domain + "/items?callback=?", { item_ids: Object.keys($.extend({},weekly_sold,monthly_sold)) }, function(json) {
    $.each(json.result, function(i, v) {
      items_hash[v.id] = v;
    });
    $("#report").html(
      '<div class="span12">' +
        '<h3>Top Selling Items Last Week</h3>' +
        '<ul class="thumbnails">' + item_img_html(weekly_sold, items_hash) + '</ul>' +
      '</div>' +
      '<div class="span12">' +
        '<h3>Top Selling Items Last Month</h3>' +
        '<ul class="thumbnails">' + item_img_html(monthly_sold, items_hash) + '</ul>' +
      '</div>'
    );
    set_stars();
  });
}

// report helper functions
function load_report_data(url, data, callback) {
  $("#loading_div").show();
  $.getJSON(url, data, function(result) {
    $("#loading_div").hide();
    callback(result);
  })
    .fail(function() { console.log( "error accessing " + url + " with params " + data ); });
}

function item_img_html(items_sold, items_hash) {
  var html = "";
  for(var k in items_sold) {
    var item = items_hash[k],
        img_url = item.img_url;
    if(img_url === undefined || img_url == null) {
      img_url = "holder.js/200x200";
    }
    html +=
      '<li><div class="thumbnail">' +
        '<h6 style="height: 30px;">' + cap_words((item.name).substring(0,55)) + '</h6>' +
        '<img src="' + img_url + '" style="max-width:200px;height:200px;">' +
        '<label><b>Rating: </b><div class="star read-only" data-rating="' + item.rating + '"></div></label>' +
        '<label><b>Price: </b>$' + item.prices[1] + ' <b>Sold: </b>' + items_sold[k] + '</label>' +
      '</div></li>';
  }
  return html;
}

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

function plot_pie_chart(div_id, data, options) {
  $.plot(div_id, data, {
    series: {
      pie: {
        show: true,
        radius: 1,
        label: {
          show: true,
          threshold: 0.03,
          radius: 2/3,
          formatter: function(label, series) {
            return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
          },
          background: {
            opacity: 0.5,
            color: "#000"
          }
        }
      }
    },
    legend: {
      show: false
    },
    grid: {
      hoverable: options.hoverable,
      clickable: options.clickable
    }
  });
}

// type corresponds to what should be displayed for the hovered item. options include percent and currency.
function plot_category_bar_chart(div_id, data, type, cols) {
  $.plot(div_id, data, {
    legend: {
      position: "right",
      noColumns: cols
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
  graph_tooltip(div_id, function(item) {
    var y = item.datapoint[1] - item.datapoint[2];
    if(type == "percent") {
      return y.toFixed(2) + "%";
    }
    return "$" + y.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }, false);
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
    'font-size': '8pt'
  }).appendTo("body").fadeIn(0);
}

function weekend_areas(axes) {
  var markings = [],
      d = new Date(axes.xaxis.min);

  // start at the first Saturday
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
  d.setUTCSeconds(0);
  d.setUTCMinutes(0);
  d.setUTCHours(0);

  var i = d.getTime();

  do {
    markings.push({
      xaxis: {
        from: i,
        to: i + 2 * 24 * 60 * 60 * 1000
      }
    });
    i += 7 * 24 * 60 * 60 * 1000;
  } while(i < axes.xaxis.max);

  return markings;
}
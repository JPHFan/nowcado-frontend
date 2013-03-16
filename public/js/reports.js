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

$("#reports_content ul.nav a").click(function(e) {
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
  if(cur_report == null) {
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
    percent_location: 0.20,
    percent_location_percent_loyal: 0.75,
    percent_price: 0.38,
    percent_price_percent_loyal: 0.67,
    percent_quality: 0.42,
    percent_quality_percent_loyal: 0.82,
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

function store_loyalty() {
  var data = {
    percent_loyal_wins: 0.72,
    percent_loyal_wins_percent_price: 0.24,
    percent_loyal_wins_percent_location: 0.31,
    percent_loyal_wins_percent_quality: 0.45,
    c_d: [[1291161600000, 0.5403234752784967], [1291248000000, 0.990526177143305], [1291334400000, 0.77233495047995], [1291420800000, 0.21576405714129998], [1291507200000, 0.266153317960787], [1291593600000, 0.7361416902889195], [1291680000000, 0.5457189004653441], [1291766400000, 0.8594159698774231], [1291852800000, 0.26297233593584923], [1291939200000, 0.7106633210362244], [1292025600000, 0.4919045899722789], [1292112000000, 0.6696226503872519], [1292198400000, 0.8730963917726424], [1292284800000, 0.5633610289171835], [1292371200000, 0.9835294119062501], [1292457600000, 0.10572606823321029], [1292544000000, 0.1555737162786739], [1292630400000, 0.37137751488794435], [1292716800000, 0.2761840277876809], [1292803200000, 0.20404323619500275], [1292889600000, 0.9923470867412832], [1292976000000, 0.632515850943938], [1293062400000, 0.27311451876684545], [1293148800000, 0.8799834991432782], [1293235200000, 0.31312916292716697], [1293321600000, 0.6141586311650488], [1293408000000, 0.966150350939602], [1293494400000, 0.1495988039650521], [1293580800000, 0.3851243855983476], [1293667200000, 0.20808650058222278], [1293753600000, 0.1515015575018872], [1293840000000, 0.47324466914509067], [1293926400000, 0.592695335697514], [1294012800000, 0.0714694421347375], [1294099200000, 0.212998821801626], [1294185600000, 0.2053683118531182], [1294272000000, 0.9970615079641574], [1294358400000, 0.32792216710307553], [1294444800000, 0.473716553879149], [1294531200000, 0.7836379249624316], [1294617600000, 0.27430046542326814], [1294704000000, 0.8041486070617431], [1294790400000, 0.8473789613874051], [1294876800000, 0.7909872002365893], [1294963200000, 0.6637192825476997], [1295049600000, 0.550171366607075], [1295136000000, 0.9462302834078616], [1295222400000, 0.9552049261270605], [1295308800000, 0.0347363011234455], [1295395200000, 0.2563907697061415], [1295481600000, 0.36734657853084307], [1295568000000, 0.3231079753654078], [1295654400000, 0.6000870685520344], [1295740800000, 0.6026921857639035], [1295827200000, 0.28438866106826666], [1295913600000, 0.3256917258925017], [1296000000000, 0.3987050602515676], [1296086400000, 0.8787123302022888], [1296172800000, 0.8787327264968774], [1296259200000, 0.489540038828042], [1296345600000, 0.9894458847453099], [1296432000000, 0.6249633955082698], [1296518400000, 0.5093139779063114], [1296604800000, 0.5018950785858451], [1296691200000, 0.23837061979450824], [1296777600000, 0.7381497296356783], [1296864000000, 0.7358187945990093], [1296950400000, 0.9888947460821903], [1297036800000, 0.18286859405713718], [1297123200000, 0.8136399738814909], [1297209600000, 0.5630915689513899], [1297296000000, 0.15520508469618166], [1297382400000, 0.23986576149334227], [1297468800000, 0.35062902844019983], [1297555200000, 0.49788538091598866], [1297641600000, 0.8841433021057028], [1297728000000, 0.9242367010155703], [1297814400000, 0.6862125777547512], [1297900800000, 0.9362437503834921], [1297987200000, 0.904525155845051], [1298073600000, 0.20083399355742548], [1298160000000, 0.13091711781644078], [1298246400000, 0.6208788485924028], [1298332800000, 0.8979784889465144], [1298419200000, 0.2905607863487858], [1298505600000, 0.7962238938068191], [1298592000000, 0.619524351297747], [1298678400000, 0.31922439583259876], [1298764800000, 0.6070036292654035], [1298851200000, 0.9079486717314195], [1298937600000, 0.09952226197883385], [1299024000000, 0.6197433558276744], [1299110400000, 0.7071206893670247], [1299196800000, 0.601452966474561], [1299283200000, 0.6936255164959839], [1299369600000, 0.016267193892708254], [1299456000000, 0.7793508890047353], [1299542400000, 0.013604531832079214], [1299628800000, 0.7270494143986189], [1299715200000, 0.019608682803590516], [1299801600000, 0.06411868710459856], [1299888000000, 0.6873465385422878], [1299974400000, 0.18830802892570087], [1300060800000, 0.17834285018191198], [1300147200000, 0.28436979911897564], [1300233600000, 0.5244990625029539], [1300320000000, 0.01933324610727072], [1300406400000, 0.10873794924701485], [1300492800000, 0.838408618570205], [1300579200000, 0.21337828717241913], [1300665600000, 0.5690058611383405], [1300752000000, 0.8398774257055946], [1300838400000, 0.18736405941267598], [1300924800000, 0.8370708271236345], [1301011200000, 0.5517120794544434], [1301097600000, 0.9781473728810982], [1301184000000, 0.10813824085192669], [1301270400000, 0.00038860240029570114], [1301356800000, 0.552287217433162], [1301443200000, 0.767714905724496], [1301529600000, 0.2151290495813064], [1301616000000, 0.13321375352229514], [1301702400000, 0.23431902260602677], [1301788800000, 0.3324229152089001], [1301875200000, 0.3077441696049028], [1301961600000, 0.5440123498244952], [1302048000000, 0.5851602313178003], [1302134400000, 0.30775217264330024], [1302220800000, 0.9697200453846648], [1302307200000, 0.14220096088717038], [1302393600000, 0.6613788664377989], [1302480000000, 0.7630579723457254], [1302566400000, 0.5740338677499596], [1302652800000, 0.9917885658480956], [1302739200000, 0.8722844548753791], [1302825600000, 0.8356253065704717], [1302912000000, 0.9882327710716772], [1302998400000, 0.521662429985476], [1303084800000, 0.2213231225060701], [1303171200000, 0.10619929200751688], [1303257600000, 0.13195397121173613], [1303344000000, 0.5213271397466155], [1303430400000, 0.4837590596869046], [1303516800000, 0.5045948418379214], [1303603200000, 0.8588192794021872], [1303689600000, 0.9355413459266915], [1303776000000, 0.9241350011159319], [1303862400000, 0.4280373141491506], [1303948800000, 0.4362266410885429], [1304035200000, 0.021048895873622353], [1304121600000, 0.4367508617110215], [1304208000000, 0.4854187979238883], [1304294400000, 0.08047446910399203], [1304380800000, 0.8444583895000609], [1304467200000, 0.38302145453421876], [1304553600000, 0.5235373750016689], [1304640000000, 0.8890176820456208], [1304726400000, 0.6821081953158191], [1304812800000, 0.18320745313353726], [1304899200000, 0.8114470768775071], [1304985600000, 0.6964605157416306], [1305072000000, 0.3852817854978362], [1305158400000, 0.3899477548077689], [1305244800000, 0.9637122441470944], [1305331200000, 0.5815767289635138], [1305417600000, 0.8237539293521899], [1305504000000, 0.9817474579943026], [1305590400000, 0.5577070180280336], [1305676800000, 0.04925182673036932], [1305763200000, 0.27741404043539764], [1305849600000, 0.8498768934009969], [1305936000000, 0.5862990960790245], [1306022400000, 0.08104294553058289], [1306108800000, 0.6398509070210632], [1306195200000, 0.08905129140917756], [1306281600000, 0.15548489679258604], [1306368000000, 0.4454577246296162], [1306454400000, 0.3038650966448184], [1306540800000, 0.9842770139804524], [1306627200000, 0.9726323949394289], [1306713600000, 0.23866182707902506], [1306800000000, 0.0009371862474089054], [1306886400000, 0.7588371719592433], [1306972800000, 0.5653057005024837], [1307059200000, 0.8679876736985336], [1307145600000, 0.6305564450782266], [1307232000000, 0.8207164237410022], [1307318400000, 0.12130156693178562], [1307404800000, 0.4032633789113179], [1307491200000, 0.6269749717880675], [1307577600000, 0.11420937935960895], [1307664000000, 0.19637127848466385], [1307750400000, 0.7048831570475809], [1307836800000, 0.22321276751910057], [1307923200000, 0.6737935944662468], [1308009600000, 0.48727810899235857], [1308096000000, 0.9449530411641829], [1308182400000, 0.827050772905866], [1308268800000, 0.7108938327656273], [1308355200000, 0.6137154190781753], [1308441600000, 0.2634812584714402], [1308528000000, 0.9300062513861225], [1308614400000, 0.06209757206582123], [1308700800000, 0.93022827777313], [1308787200000, 0.5026837833164979], [1308873600000, 0.11146078916901736], [1308960000000, 0.5125721188611175], [1309046400000, 0.6442887813654591], [1309132800000, 0.41531969364873467], [1309219200000, 0.5762234654281801], [1309305600000, 0.2196695879816225], [1309392000000, 0.5182167079888053], [1309478400000, 0.34260647067612104], [1309564800000, 0.6994784419527454], [1309651200000, 0.11621586959905461], [1309737600000, 0.9583918215051616], [1309824000000, 0.3194363814399198], [1309910400000, 0.10210595146109658], [1309996800000, 0.3779601103571022], [1310083200000, 0.492844816391551], [1310169600000, 0.48067947801532873], [1310256000000, 0.8539200869061551], [1310342400000, 0.14512837555510527], [1310428800000, 0.21384239463530796], [1310515200000, 0.8273065551389976], [1310601600000, 0.46738070915176666], [1310688000000, 0.9543225166897444], [1310774400000, 0.8058516328132729], [1310860800000, 0.938044245929559], [1310947200000, 0.5859270680589735], [1311033600000, 0.3527080633822619], [1311120000000, 0.004952764573313839], [1311206400000, 0.4039060218623608], [1311292800000, 0.32961171757125207], [1311379200000, 0.9846114964546566], [1311465600000, 0.8987450091041973], [1311552000000, 0.7562238832197188], [1311638400000, 0.9108810176538215], [1311724800000, 0.012369566058104242], [1311811200000, 0.6234474939438306], [1311897600000, 0.29856607274690705], [1311984000000, 0.31999715566541265], [1312070400000, 0.15327312094189227], [1312156800000, 0.9916636875442844], [1312243200000, 0.9528603870010813], [1312329600000, 0.8404942194446753], [1312416000000, 0.0799384074175471], [1312502400000, 0.13080750459972768], [1312588800000, 0.7289973892203009], [1312675200000, 0.08568729197126645], [1312761600000, 0.6154083183410936], [1312848000000, 0.2739840036884208], [1312934400000, 0.020180190433524925], [1313020800000, 0.17849258890601494], [1313107200000, 0.9946403027404557], [1313193600000, 0.10773110177077705], [1313280000000, 0.019210575902490645], [1313366400000, 0.9916596080043064], [1313452800000, 0.01870847970990086], [1313539200000, 0.8296633045710111], [1313625600000, 0.6687808754754023], [1313712000000, 0.5443025459814012], [1313798400000, 0.38296631814031656], [1313884800000, 0.9389694513189251], [1313971200000, 0.6663502439835236], [1314057600000, 0.5774789146504871], [1314144000000, 0.1604155996317168], [1314230400000, 0.8536761048141461], [1314316800000, 0.8367518823281833], [1314403200000, 0.21402056541003434], [1314489600000, 0.4307865441875457], [1314576000000, 0.5108110775492505], [1314662400000, 0.3014591811836155], [1314748800000, 0.7890320250660764], [1314835200000, 0.008772568497913635], [1314921600000, 0.4548247989928641], [1315008000000, 0.8382879938993671], [1315094400000, 0.8368115265197493], [1315180800000, 0.8513755941915301], [1315267200000, 0.25312176928396757], [1315353600000, 0.6403383825484626], [1315440000000, 0.5903631658747182], [1315526400000, 0.557029663015499], [1315612800000, 0.5659374368604033], [1315699200000, 0.6024351810825427], [1315785600000, 0.5428501027925469], [1315872000000, 0.9501014795723339], [1315958400000, 0.8390566508681049], [1316044800000, 0.05976216742923579], [1316131200000, 0.7349248258863085], [1316217600000, 0.7008522720474224], [1316304000000, 0.003926925367700451], [1316390400000, 0.8919321982432756], [1316476800000, 0.8691167393775722], [1316563200000, 0.0659972668711084], [1316649600000, 0.022265382688859692], [1316736000000, 0.41748336694763444], [1316822400000, 0.6724877100596705], [1316908800000, 0.9174837294103552], [1316995200000, 0.3983495889246056], [1317081600000, 0.42772930341195026], [1317168000000, 0.30061970922161196], [1317254400000, 0.2350302352526915], [1317340800000, 0.5694542281539041], [1317427200000, 0.128412913358946], [1317513600000, 0.6356207443987515], [1317600000000, 0.5074568511978681], [1317686400000, 0.2093548101362981], [1317772800000, 0.9857375310085181], [1317859200000, 0.49993060080463203], [1317945600000, 0.6553791531752814], [1318032000000, 0.4163918551466932], [1318118400000, 0.18035941797952582], [1318204800000, 0.5311626362623395], [1318291200000, 0.5245595622234673], [1318377600000, 0.6647102980104992], [1318464000000, 0.31389024220620276], [1318550400000, 0.3761999970996164], [1318636800000, 0.7425739915038604], [1318723200000, 0.2500004650360401], [1318809600000, 0.7932613103361533], [1318896000000, 0.4543792380519672], [1318982400000, 0.25962847930133726], [1319068800000, 0.5049567151255944], [1319155200000, 0.5843959606227448], [1319241600000, 0.9452171121699972], [1319328000000, 0.5931387073093126], [1319414400000, 0.08066626319732206], [1319500800000, 0.5089441741637419], [1319587200000, 0.013374127420479165], [1319673600000, 0.1252929420504154], [1319760000000, 0.08769529359812878], [1319846400000, 0.761823338241927], [1319932800000, 0.09729934209045243], [1320019200000, 0.9874023860982474], [1320105600000, 0.2355229559414248], [1320192000000, 0.338347750788788], [1320278400000, 0.17476320157999048], [1320364800000, 0.3767688671713997], [1320451200000, 0.32978489459810634], [1320537600000, 0.10157354838789467], [1320624000000, 0.8878059152352477], [1320710400000, 0.5775613982352962], [1320796800000, 0.5309458489762545], [1320883200000, 0.3353080345447589], [1320969600000, 0.23363498095081903], [1321056000000, 0.8647278418754296], [1321142400000, 0.1949885609843155], [1321228800000, 0.5455785715238138], [1321315200000, 0.644026989927474], [1321401600000, 0.5970169848605261], [1321488000000, 0.47971409251177255], [1321574400000, 0.245291554207417], [1321660800000, 0.16022323681232742], [1321747200000, 0.21474604255307517], [1321833600000, 0.4488413046433952], [1321920000000, 0.3576708118126326], [1322006400000, 0.5479136399194223], [1322092800000, 0.545009614760571], [1322179200000, 0.24032179571259615], [1322265600000, 0.1247396676512258], [1322352000000, 0.7446453485715927], [1322438400000, 0.5810188358471907], [1322524800000, 0.8551092014245258], [1322611200000, 0.7383651800707898]]
  };
  $("#report").html('<div class="row-fluid"><div class="span6" style="margin-bottom: 10px;"><span><h3 style="color: green;display: inline;">' + (data.percent_loyal_wins*100).toFixed(2) + '%</h3> of your wins are to loyal members. Of these, wins are broken down as follows: </span></div><div class="span6" style="margin-bottom: 10px; margin-top: 10px;"><span>This is how customers perceive your store over time. 100% represents an ideal rating.</span></div></div><div class="row-fluid"><div id="pie_chart" class="span6" style="height: 200px;"></div><div id="line_chart" class="span6" style="height: 200px;"></div></div><div class="row-fluid"><div id="overview" class="span6 offset6" style="height: 100px;"></div></div>');

  // plot the pie chart
  $.plot('#pie_chart', [{label: "Location", data: data.percent_loyal_wins_percent_location}, {label: "Price", data: data.percent_loyal_wins_percent_price}, {label: "Quality",data: data.percent_loyal_wins_percent_quality}], {
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
    }
  });

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

  // convert percentages
  for(var i=0; i < data.c_d.length; i++) {
    data.c_d[i][1] *= 100;
  }

  // plot the line chart
  var plot = $.plot('#line_chart',[data.c_d],options);

  // add tooltip functionality to the line chart
  graph_tooltip("#line_chart", function(item) {
    return (item.datapoint[1].toFixed(2) + "%");
  }, false);

  // plot the overview
  var overview = $.plot("#overview",[data.c_d], {
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
    plot = $.plot("#line_chart", [data.c_d], $.extend(true, {}, options, {
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
}

function store_rt_inv() {
  var items_hash = {},
      series_names = {},
      data = {};
  $("#report").html('<div class="row-fluid input-append"><select id="rt_item_store_select" class="span3"></select><input type="text" id="store_item_search" placeholder="Search for items in your store(s)" class="span7"><button type="button" class="btn btn-primary" id="add_to_report">Add To Report</button></div><div class="row-fluid"><div id="line_chart" style="height: 300px;margin-top: 10px; margin-bottom: 20px;"></div></div><div class="row-fluid" id="line_chart_legend"></div><div class="row-fluid"><table class="table table-bordered"><thead><tr><th>Store</th><th>Item</th><th>Remove</th></tr></thead><tbody id="table_series"></tbody></table></div>');
  $("#store_item_search").typeahead({
    source: function(query, process) {
      $.getJSON(domain + "/items?callback=?", { store_ids: stores, name: query }, function(json) {
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
  graph_tooltip(div_id, function(item) {
    var y = item.datapoint[1] - item.datapoint[2];
    if(type == "percent") {
      return y.toFixed(2) + "%";
    }
    return "$" + y.toFixed(2);
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
    border: '1px solid #fdd',
    padding: '2px',
    'background-color': '#fee',
    opacity: 0.80,
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
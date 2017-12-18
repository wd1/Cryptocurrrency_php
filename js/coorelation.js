function getCorr(theCurrencyC){
    $('#coorelationChart').hide();
    $("#coorLoad").fadeIn();
 $('#coorelation').css('opacity', .1);
 $('#coorelation h1').html('--');
 $('#coorelation .panel-title').html('')


try{
if($('#currencypair').val().indexOf('-maybe') !=-1 && $('#exchange').val().indexOf('--') ==-1){

}
else{
  
}
}

catch(err){

}


    if(typeof theCurrencyC != 'string'){
        coorCur = $('#currencypair').val().split('-maybe')[0];
       

    }

    else{
        coorCur = theCurrencyC;

        // $('.traditionalCats').show();
       //$('.cryptoCats').hide();

    }
    


    $.ajax({
        url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/coorelation.php',
        data:{'code1':coorCur, 'section':$('.cryptoCats select').val(), 'period':$('#coorPeriod').val()},
        complete:function(transport){
             $("#coorLoad").fadeOut();
            coorResp = $.parseJSON(transport.responseText);

            console.log(coorResp);
             $('#coorelation').css('opacity', 1);
         
            $('#coorelation').html('');

            for(i in coorResp){

              /*
               if( chartRequestUrl == 'https://stark-island-54204.herokuapp.com/cloud/api/beta/getStockChart.php' ){
                  //back wards
                  console.log('stock/com pair')

                  if(coorResp[i]['coorelation'] <0){
                    coorResp[i]['coorelation'] = coorResp[i]['coorelation']+1;
                  }
                  else{
                     coorResp[i]['coorelation'] = coorResp[i]['coorelation']-1;
                  }
                }
*/

                if(coorResp[i]['coorelation'] >.8){
                    //light blue
                    backColor = '#04B5FC';

                }
                else if(coorResp[i]['coorelation'] >.6){
                    backColor = '#3880C9';
                }

                else if(coorResp[i]['coorelation'] >.4){
                    backColor='#284A68';
                }

                else if(coorResp[i]['coorelation'] >.2){
                    backColor= '#203243';
                }

               else  if(coorResp[i]['coorelation'] >0){
                    backColor='#28434E'
                }


                else  if(coorResp[i]['coorelation'] >-.2){
                    backColor= '#7D4703';
                    //dark orange
                }



                else  if(coorResp[i]['coorelation'] >-.4){
                    backColor='#AD6305';
                }


                else  if(coorResp[i]['coorelation'] >-.6){
                    backColor='#CD7504';
                }


                else  if(coorResp[i]['coorelation'] >-.8){
                    backColor='#E58305';
                }
                else{
                    //light orange
                    backColor= '#FF9002';
                }


                coorString ='<div class="col-lg-4"><a href="javascript:renderCoorChart(\''+coorCur+'\', \''+coorResp[i]['symbol']+'\')"><div class="panel panel-color panel-warning"><div class="panel-heading" style="background-color:'+backColor+'"><h3 class="panel-title">'+coorResp[i]['name']+'</h3></div><div class="panel-body"><h1 style="font-size:80px; text-align:center; margin-top:40px">'+coorResp[i]['coorelation'].toFixed(2)+'</h1></div></div></a></div>';
                $('#coorelation').append(coorString);
            }
            

        }
    })
}


getCorr();

$('#currencypair').on('change', function(){

    getCorr();

})

$('body').on('click', '#resultsContainer a', function (){

     getCorr($(this).attr('link'));
})


$('.cryptoCats select').on('change', function(){
  $('#containerCoor').hide();
    getCorr(coorCur);
})


$('#coorPeriod').on('change', function(){
   $('#containerCoor').hide();
    getCorr(coorCur);
})





function renderCoorChart(code1, code2){
$("#coorLoad").show();
    $('#containerCoor').show('slow');
    seriesOptions = [],
    seriesCounter = 0,
    names = [code1, code2];

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */

$.each(names, function (i, name) {

    $.getJSON('https://stark-island-54204.herokuapp.com/cloud/api/beta/coorelationChart.php?code1=' + name +"&period="+ $('#coorPeriod').val(),    function (data) {
      $("#coorLoad").fadeOut();

        seriesOptions[i] = {
            name: name,
            data: data
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            createChart();
        }
    });
});

}





function createChart() {




                Highcharts.theme = {
                   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
                   chart: {
                      backgroundColor: "#2f3e47",
                      style: {
                         fontFamily: '\'Unica One\', sans-serif'
                      },
                      plotBorderColor: '#606063'
                   },
                   title: {
                      style: {
                         color: '#E0E0E3',
                         textTransform: 'uppercase',
                         fontSize: '20px'
                      }
                   },
                   subtitle: {
                      style: {
                         color: '#E0E0E3',
                         textTransform: 'uppercase'
                      }
                   },
                   xAxis: {
                      gridLineColor: '#707073',
                      labels: {
                         style: {
                            color: '#E0E0E3'
                         }
                      },
                      lineColor: '#707073',
                      minorGridLineColor: '#505053',
                      tickColor: '#707073',
                      title: {
                         style: {
                            color: '#A0A0A3'

                         }
                      }
                   },
                   yAxis: {
                      gridLineColor: '#707073',
                      labels: {
                         style: {
                            color: '#E0E0E3'
                         }
                      },
                      lineColor: '#707073',
                      minorGridLineColor: '#505053',
                      tickColor: '#707073',
                      tickWidth: 1,
                      title: {
                         style: {
                            color: '#A0A0A3'
                         }
                      }
                   },
                   tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      style: {
                         color: '#F0F0F0'
                      }
                   },
                   plotOptions: {
                      series: {
                         dataLabels: {
                            color: '#B0B0B3'
                         },
                         marker: {
                            lineColor: '#333'
                         }
                      },
                      boxplot: {
                         fillColor: '#505053'
                      },
                      candlestick: {
                         lineColor: '#f05050',
                         color: "#f05050",
                         upColor: '#0dc569',
                         upLineColor: "#0dc569"
                      },
                      errorbar: {
                         color: 'white'
                      }
                   },
                   legend: {
                      itemStyle: {
                         color: '#E0E0E3'
                      },
                      itemHoverStyle: {
                         color: '#FFF'
                      },
                      itemHiddenStyle: {
                         color: '#606063'
                      }
                   },
                   credits: {
                      style: {
                         color: '#666'
                      }
                   },
                   labels: {
                      style: {
                         color: '#707073'
                      }
                   },

                   drilldown: {
                      activeAxisLabelStyle: {
                         color: '#F0F0F3'
                      },
                      activeDataLabelStyle: {
                         color: '#F0F0F3'
                      }
                   },

                   navigation: {
                      buttonOptions: {
                         symbolStroke: '#DDDDDD',
                         theme: {
                            fill: '#505053'
                         }
                      }
                   },

                   // scroll charts
                   rangeSelector: {
                      buttonTheme: {
                         fill: '#505053',
                         stroke: '#000000',
                         style: {
                            color: '#CCC'
                         },
                         states: {
                            hover: {
                               fill: '#707073',
                               stroke: '#000000',
                               style: {
                                  color: 'white'
                               }
                            },
                            select: {
                               fill: '#000003',
                               stroke: '#000000',
                               style: {
                                  color: 'white'
                               }
                            }
                         }
                      },
                      inputBoxBorderColor: '#505053',
                      inputStyle: {
                         backgroundColor: '#333',
                         color: 'silver'
                      },
                      labelStyle: {
                         color: 'silver'
                      }
                   },

                   navigator: {
                      handles: {
                         backgroundColor: '#666',
                         borderColor: '#AAA'
                      },
                      outlineColor: '#CCC',
                      maskFill: 'rgba(255,255,255,0.1)',
                      series: {
                         color: '#7798BF',
                         lineColor: '#A6C7ED'
                      },
                      xAxis: {
                         gridLineColor: '#505053'
                      }
                   },

                   scrollbar: {
                      barBackgroundColor: '#808083',
                      barBorderColor: '#808083',
                      buttonArrowColor: '#CCC',
                      buttonBackgroundColor: '#606063',
                      buttonBorderColor: '#606063',
                      rifleColor: '#FFF',
                      trackBackgroundColor: '#404043',
                      trackBorderColor: '#404043'
                   },

                   // special colors for some of the
                   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                   background2: 'red',
                   dataLabelsColor: '#B0B0B3',
                   textColor: '#C0C0C0',
                   contrastTextColor: '#F0F0F3',
                   maskColor: 'rgba(255,255,255,0.3)'
                };

Highcharts.setOptions(Highcharts.theme);

    Highcharts.stockChart('containerCoor', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    })


     


Highcharts.setOptions(Highcharts.theme);


}


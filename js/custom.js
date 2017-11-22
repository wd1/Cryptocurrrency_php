 
    $(document).ready(function(){
                userAuth();
                initCandleChart();
                listenForChartUpdate();


            })






 function renderOrderBook(exchange, currencypair){

      $('.symbol1').html(currencypair.replace('USD', ''));
 chart = AmCharts.makeChart("chartdiv", {
  "type": "serial",
  "theme": "dark",
  "dataLoader": {
    //https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_ETH&depth=50
    "url": "https://stark-island-54204.herokuapp.com/cloud/api/beta/order"+whichExchange+".php?currencypair="+currencypair,
    "format": "json",
    "reload": 30,
    "postProcess": function(data) {
      rData = data;
      
      // Function to process (sort and calculate cummulative volume)
      function processData(list, type, desc) {
        
        // Convert to data points
        for(var i = 0; i < list.length; i++) {
          list[i] = {
            value: Number(list[i][0]),
            volume: Number(list[i][1]),
          }
        }
       
        // Sort list just in case
        list.sort(function(a, b) {
          if (a.value > b.value) {
            return 1;
          }
          else if (a.value < b.value) {
            return -1;
          }
          else {
            return 0;
          }
        });
        
        // Calculate cummulative volume
        if (desc) {
          for(var i = list.length - 1; i >= 0; i--) {
            if (i < (list.length - 1)) {
              list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
            }
            else {
              list[i].totalvolume = list[i].volume;
            }
            var dp = {};
            dp["value"] = list[i].value;
            dp[type + "volume"] = list[i].volume;
            dp[type + "totalvolume"] = list[i].totalvolume;
            res.unshift(dp);
          }
        }
        else {
          for(var i = 0; i < list.length; i++) {
            if (i > 0) {
              list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
            }
            else {
              list[i].totalvolume = list[i].volume;
            }
            var dp = {};
            dp["value"] = list[i].value;
            dp[type + "volume"] = list[i].volume;
            dp[type + "totalvolume"] = list[i].totalvolume;
            res.push(dp);
          }
        }
       
      }
      
      // Init
      var res = [];
      processData(data.bids, "bids", true);
      processData(data.asks, "asks", false);

      $("#md-buy-tbody").html('');
        $("#md-sell-tbody").html('');
      for(i in data.bids){


        if(i <15){

         renderSellBuyTD("#md-buy-tbody", data.bids[i]['volume'], data.bids[i]['value']);
        }
      }

      for(i in data.asks){
             if(i <15){

        renderSellBuyTD("#md-sell-tbody", data.asks[i]['volume'], data.asks[i]['value']);
      }
      }
      
      //console.log(res);
      return res;
    }
  },
  "graphs": [{
    "id": "bids",
    "fillAlphas": 0.1,
    "lineAlpha": 1,
    "lineThickness": 2,
    "lineColor": "#0f0",
    "type": "step",
    "valueField": "bidstotalvolume",
    "balloonFunction": balloon
  }, {
    "id": "asks",
    "fillAlphas": 0.1,
    "lineAlpha": 1,
    "lineThickness": 2,
    "lineColor": "#f00",
    "type": "step",
    "valueField": "askstotalvolume",
    "balloonFunction": balloon
  }, {
    "lineAlpha": 0,
    "fillAlphas": 0.2,
    "lineColor": "#000",
    "type": "column",
    "clustered": false,
    "valueField": "bidsvolume",
    "showBalloon": false
  }, {
    "lineAlpha": 0,
    "fillAlphas": 0.2,
    "lineColor": "#000",
    "type": "column",
    "clustered": false,
    "valueField": "asksvolume",
    "showBalloon": false
  }],
  "categoryField": "value",
  "chartCursor": {},
  "balloon": {
    "textAlign": "left"
  },
  "valueAxes": [{
    "title": "Volume"
  }],
  "categoryAxis": {
    "title": "Price (BTC/ETH)",
    "minHorizontalGap": 100,
    "startOnAxis": true,
    "showFirstLabel": false,
    "showLastLabel": false
  },
  "export": {
    "enabled": true
  }
});

}

function balloon(item, graph) {
  var txt;
  if (graph.id == "asks") {
    txt = "Ask: <strong>" + formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
      + "Total volume: <strong>" + formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />"
      + "Volume: <strong>" + formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
  }
  else {
    txt = "Bid: <strong>" + formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
      + "Total volume: <strong>" + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />"
      + "Volume: <strong>" + formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
  }
  return txt;
}

function formatNumber(val, chart, precision) {
  return AmCharts.formatNumber(
    val, 
    {
      precision: precision ? precision : chart.precision, 
      decimalSeparator: chart.decimalSeparator,
      thousandsSeparator: chart.thousandsSeparator
    }
  );
}









 function placeOrder(){

            alert("Real Orders coming soon. You will be able to add your authentication keys here, store them locally, and the orders will be placed and appear in your real balance above in the nav bar, next to your mock balances.");
          }
            function updateCandleChart(){

                whichExchange = $('#exchange').val();
                whichCurrency = $('#currencypair').val();
                whichPeriod = $('#period').val();
                renderCandleChart(whichExchange, whichCurrency, whichPeriod);

            }

            function updateOrderBook(){
                  whichExchange = $('#exchange').val();
                whichCurrency = $('#currencypair').val();
              
                renderOrderBook(whichExchange, whichCurrency);
            }


            function renderCandleChart(exchange, currencypair, period){
                $.getJSON('https://stark-island-54204.herokuapp.com/cloud/api/beta/'+exchange+'.php?currencypair='+currencypair+"&period="+period, function (data) {
console.log(data)
hideLoading();
if(typeof data.status =="string"){
    alert(data.msg);
    return;
}
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]],

        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }


    // create the chart



    Highcharts.theme = {
   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
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
         lineColor: 'white'
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
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);


    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: currencypair + ' Historical'
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'candlestick',
            name: currencypair,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]
    });
});
            }




function renderSellBuyTD(selector, amount, price){

  $(selector).append('<tr id="md-sell-7583-9884" price="'+price+'" amount="19853200" t="sell" style="cursor: pointer;"><td>'+price+'</td><td class="amount"><i class="icn icn-BTC"></i>'+amount+'</td></tr>');
}


function listenForChartUpdate(){

    $('#hello select').on("change", function(){
        showLoading()
        updateCandleChart();
        updateOrderBook(whichExchange, whichCurrency);
    })
}


            function initCandleChart(){

                 whichExchange = $('#exchange').val();
                whichCurrency = $('#currencypair').val();
                whichPeriod = $('#period').val();
                renderCandleChart(whichExchange, whichCurrency, whichPeriod);
                renderOrderBook(whichExchange, whichCurrency);
            }




            function showLoading(){

                $('#theLoader').fadeIn();
            }

             function hideLoading(){

                $('#theLoader').fadeOut();
            }


          

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  function userAuth(){

if(localStorage.getItem('oauth') != null && localStorage.getItem('oauth') != ""){
  oauthString = "?oauth="+ localStorage.getItem('oauth') ;
}
else{
  oauthString= "";
}
    $.ajax({
      url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/getUserInfo.php'+oauthString,
      complete:function(transport){

        theResp = $.parseJSON(transport.responseText);
        if(theResp['status'] =='success'){
           $('#user').html('Mock Portfolio: ');
           $('#userBalance').html("$"+ numberWithCommas(parseFloat(theResp.balanceInfo['totalAssets']).toFixed(2)));
          $('#signer').html("<a href='javascript:logout()'>Logout</>");
        }
        else{
          localStorage.setItem('oauth', theResp.user[0]['oauth']);

          $('#userBalance').html("$"+ numberWithCommas(parseFloat(theResp.balanceInfo['totalAssets']).toFixed(2)));
          
        }

        if(typeof theResp['orders'] == "object"){
          for(i in theResp['orders']){
            thisOrder = theResp['orders'][i];
            renderActiveOrders(thisOrder['rId'], thisOrder['timestamp'], thisOrder['type'], thisOrder['amount'], thisOrder['price'], thisOrder['symbol']);


          }
        }
        


      }
    })
  }

  function register(){

    if($('#signupEmail').val().length < 5){
      alert("Please enter a valid email")
      return;
    }
     if($('#signupPw').val().length < 2){
      alert("Please enter a valid password")
      return;
    }

    $('#signupForm button').html('signing up...')

    if(localStorage.getItem('oauth') != null && localStorage.getItem('oauth') != ""){
        oauthString = "?oauth="+ localStorage.getItem('oauth') ;
      }
    else{
      oauthString= "";
    }

           $.ajax({
      url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/register.php'+oauthString,
      data:{
        email:$('#signupEmail').val(),
        pw:$('#signupPw').val()
      },
      method:"POST",
      complete:function(transport){

        theResp = $.parseJSON(transport.responseText);
        if(theResp['status'] =='success'){
          $('#signupForm button').html('Please wait')
          window.location=window.location.href;
              
        }
        else{
          alert("Sorry that email is already taken or invalid.");
          $('#signupForm button').html('Finish')
        }
      }
    })


    }
  

  function login(){


 if($('#loginEmail').val().length < 5){
      alert("Please enter a valid email")
      return;
    }
     if($('#loginPw').val().length < 2){
      alert("Please enter a valid password")
      return;
    }



    $('#loginForm button').html('logging in...')
           $.ajax({
      url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/login.php',
      data:{
        email:$('#loginEmail').val(),
        pw:$('#loginPw').val()
      },
      method:"POST",
      complete:function(transport){

        theResp = $.parseJSON(transport.responseText);
        if(theResp['status'] =='success'){
          $('#loginForm button').html('Please wait')
     
              
        }
        else{
          alert("Something went wrong. Please try again");
          $('#signupForm button').html('Finish')
        }
      }
    })

  }


  function logout(){
      $.ajax({
      url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/logout.php',
      complete:function(transport){
        localStorage.setItem('oauth', "");
        window.location=window.location.href;
      }
    })
  
  }
  function renderActiveOrders(orderId, timestamp, type, amount, price, currency){

    theTrString = '<tr id="order-'+orderId+'" class=""><td>'+timestamp+'</td><td><i class="icn-cart-in"></i>'+type+'</td><td><i class="icn icn-BTC"></i>'+amount+'</td><td class="remains"><i class="icn icn-BTC"></i>'+amount+'</td><td>'+price+'</td><td><i class="icn icn-USD"></i>'+currency+'</td><td class="fee"> 0.00 </td><td class="action"><button class="btn btn-red btn-mini" onclick="cancelOrder('+orderId+')"><i class="icn-remove icon-white"></i> Cancel</button></td></tr>';
    $('#orders-tbody').append(theTrString);

  }

  function cancelOrder(orderId){
 
    $('#order-'+orderId).remove();

    $.ajax({
      url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/cancelMockOrder.php?oauth='+localStorage.getItem('oauth')+'&orderId='+orderId,
      complete:function(transport){
        alert("Order Cancelled");
        console.log(transport.responseText);
      }
    })
  }


  function placeMockBuyOrder(){

    $('#mockBuyButton').html("Placing order...");
    buyPrice = $('#buyPrice').val();
    buyAmount= $('#buyAmount').val();
    buySymbol = $('#currencypair').val().split("USD")[0];
    buyType = "buy";

    if(isNaN(buyPrice) || buyPrice==""){
      alert("Please enter a buy price that is a number")
      return;
    }

     if(isNaN(buyAmount || buyAmount=="")){
      alert("Please enter a buy amount that is a number")
      return;
    }

    placeMockOrder(buySymbol, buyPrice, buyAmount, buyType);

  }
  function placeMockSellOrder(){
      $('#mockSellButton').html("Placing order...");
    sellPrice = $('#sellPrice').val();
    sellAmount= $('#sellAmount').val();
   sellSymbol = $('#currencypair').val().split("USD")[0];
   sellType = "sell";


   if(isNaN(sellPrice) || sellPrice==""){
      alert("Please enter a sell price that is a number")
      return;
    }

     if(isNaN(sellAmount) || sellAmount==""){
      alert("Please enter a sell amount that is a number")
      return;
    }

      placeMockOrder(sellSymbol, sellPrice, sellAmount, sellType);
  }

  function placeMockOrder(symbol, price, amount, type){

     if(localStorage.getItem('oauth') != null && localStorage.getItem('oauth') != ""){
       theOrderData= {"symbol":symbol,"price":price,"amount":amount, "type":type, "oauth": localStorage.getItem('oauth')};
      }
    else{
       theOrderData= {"symbol":symbol,"price":price,"amount":amount, "type":type};
    }

      $.ajax({
        url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/createMockOrder.php',
          data:theOrderData,

          complete:function(transport){
             $('#mockBuyButton').html("Placing Mock Order");
             $('#mockSellButton').html("Placing Mock Order");
          
            theResp1 = $.parseJSON(transport.responseText);
            console.log(theResp1);

            if(theResp1['status']=="fail"){
              alert(theResp1['msg']);
              return;
              }
             $('#userBalance').html("$"+ numberWithCommas(theResp1.balanceInfo['totalAssets'].toFixed(2)));

             if(theResp1['filledStatus']=="filled"){
              alert("Order has been instantly filled ");

             }
             else{

              renderActiveOrders(theResp1['data']['rId'], theResp1['data']['timestamp'], theResp1['data']['type'], theResp1['data']['amount'], theResp1['data']['price'], theResp1['data']['symbol']);
              alert("Your order is now active. Once the market reaches your offer, it will be filled. You can view your order or cancel it below in 'Active Orders'.");


             }



          }
      })
  }





            
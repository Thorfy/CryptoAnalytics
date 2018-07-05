var app = angular.module("cryptoAnalytics", []);
app.controller("statBarCtrl",function ($scope){
	$scope.currencies = ['BTC', 'ETH', 'XPR', 'LTC', 'EOS', 'BCH'];
});
app.controller("statPannelChart",function ($scope){
	$.getJSON('cryptoAnaliticsApi/inc/getHistorical.inc.php/?function=getHistoricalDay', function (response) {
    var ohlc = [];
    for(var i = 0; i<response.Data.length; i++){
        var stockObject = response.Data[i];
        var outputOhlc = [
        stockObject.time*1000,
        stockObject.close,
        stockObject.high,
        stockObject.low,
        stockObject.open
        // stockObject.volumefrom,
        // stockObject.volumeto
        ]
        ohlc.push(outputOhlc);
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

     // create the chart
     Highcharts.stockChart('container', {

        plotOptions: {
            candlestick: {
                color: '#28a745',
                upColor: '#dc3545'
            }
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'TEST2'
        },

        series: [{
            type: 'candlestick',
            name: 'TEST',
            data: ohlc,
        }]
    });
 });
});

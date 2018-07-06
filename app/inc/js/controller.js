var app = angular.module("cryptoAnalytics", []);
app.controller("statBarCtrl",function ($scope){
	$scope.currencies = [
    {
        name:'BTC',
        title:'Bitcoin',
        price: 6567.44,
        sign:'$',
        classInfo:'secondary',
        percent:1.85,
        chevron: "bottom"
    },{
        name:'ETH',
        title:'Etherum',
        price: 465.70,
        sign:'$',
        classInfo:'secondary',
        percent:2.46,
        chevron: "bottom"
    },{
        name:'LTC',
        title:'LiteCoin',
        price: 82.18,
        sign:'$',
        classInfo:'danger',
        percent:3.21,
        chevron: "bottom"
    },{
        name:'EOS',
        title:'EOS',
        price: 8.51,
        sign:'$',
        classInfo:'danger',
        percent:5.17,
        chevron: "bottom"
    },{
        name:'XRP',
        title:'XRP',
        price: 0.466003,
        sign:'$',
        classInfo:'danger',
        percent:4.97,
        chevron: "bottom"
    },{
        name:'BCH',
        title:'BitcoinCash',
        price: 723.66,
        sign:'$',
        classInfo:'danger',
        percent:5.17,
        chevron: "bottom"
    }];
});
app.controller("statPannelChartCtrl",function ($scope){
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
app.controller("searchCtrl",function ($scope){

    $.getJSON('app/inc/json/staticSearch.json', function(response){
        $scope.searchResults = response.Data;
    })

    // $scope.search = function(){
    //     if($scope.searchQuery){
    //         console.log($scope.searchQuery)
    //         let output = []
    //         let countResult = 0
    //         for(let obj in $scope.jsonSearch){
    //             if($scope.jsonSearch[obj].FullName.includes($scope.searchQuery)){
    //                 output.push($scope.jsonSearch[obj]);
    //                 countResult++
    //             }
    //         }
    //         return $scope.searchResults = output;
    //     }
    // }


});
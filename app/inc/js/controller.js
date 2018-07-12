var app = angular.module("cryptoAnalytics", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {templateUrl:'app/inc/views/home.html'})
    .when('/currencies', {templateUrl:'app/inc/views/currencies.html', controller:'currenciesCtrl'})
    .when('/currencies/:symbol', {templateUrl:'app/inc/views/currency.html', controller:'currencyCtrl'})
    .otherwise({redirectTo:'/'})

})


app.factory('GetApiInfo', function($http, $q){
    var deferred = $q.defer()
    var apiInfo = {
        getFullData: function(fsyms, tsyms){

            $http.get("cryptoAnaliticsApi/fonction_api/apiPrice.php/?function=getPriceMultiFull&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject('pas de connection')
            })
            return deferred.promise
        },
        getSymbol: function(){

            $http.get("app/inc/json/staticSearch.json").success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject('pas de connection')
            })
            return deferred.promise
        }
    }
    return apiInfo    

})

app.controller('currenciesCtrl', function($scope, GetApiInfo){
    $scope.currencies = GetApiInfo.getSymbol().then(function(response){
      $scope.currencies = response
  },function(error){
    $scope.currencies = error
})
})

app.controller('currencyCtrl', function($scope, $routeParams, GetApiInfo){
    console.log($routeParams.symbol)
    $scope.currencyData = GetApiInfo.getFullData($routeParams.symbol,["USD"]).then(function(response){
        $scope.currencyData = response
    },function(error){
        $scope.currencyData = error
    })
})


app.controller('searchCtrl', function ($scope, GetApiInfo){
    $scope.symbols = GetApiInfo.getSymbol().then(function(response){
        console.log(response)
        $scope.symbols = response
    },function(error){
        $scope.symbols = error
    })
})

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



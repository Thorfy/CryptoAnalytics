var app = angular.module("cryptoAnalytics", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {templateUrl:'app/inc/views/home.html'})
    .when('/currencies', {templateUrl:'app/inc/views/currencies.html', controller:'currenciesCtrl'})
    .when('/currencies/:symbol', {templateUrl:'app/inc/views/currency.html', controller:'currencyCtrl'})
    .when('/account', {templateUrl:'app/inc/views/account.html', controller:'accountCtrl'})
    .otherwise({redirectTo:'/'})

})

app.controller('currenciesCtrl', function($scope, ApiCurrencies){
    if(ApiCurrencies.flag === true){
        $scope.currencies = ApiCurrencies.getCurrency()
    }else{
        $scope.currencies = ApiCurrencies.setCurrency().then(function(response){
            $scope.currencies = response
        })
    }
})

app.controller('connectionInscriptionCtrl', function($scope, GetUserConnection){
    $scope.info = GetUserConnection.testConnect().then(function(response){
        console.log(GetUserConnection)
        $scope.info = response
    },function(error){
        console.log(GetUserConnection)
        $scope.info = error
    })
})

app.controller('accountCtrl',function($scope,GetUserConnection, ApiCurrencies){
    if(ApiCurrencies.flag === true){
        $scope.symbols = ApiCurrencies.getCurrency()
    }else{
        $scope.symbols = ApiCurrencies.setCurrency().then(function(response){
            $scope.symbols = response
        })
    }
})

app.controller('currencyCtrl', function($scope, $routeParams){
    // aller chercher les data pour 1 seule monnaie
})


app.controller('searchCtrl', function ($scope, GetApiInfo, ApiCurrencies){
    if(ApiCurrencies.flag === true){
        $scope.Data = ApiCurrencies.getCurrency()
    }else{
        $scope.Data = ApiCurrencies.setCurrency().then(function(response){
            $scope.Data = response
        })
    }
})

app.controller("statBarCtrl",function ($scope, ApiFullData){
    //data preference ou data by default
    $scope.defaultCrypto = ['BTC','LTC','ETH','EOS','XRP','BCH']
    $scope.defaultVal = ['USD']
    if(ApiFullData.flag === true){
        $scope.currencies = ApiFullData.getFullData()
    }else{
        $scope.currencies = ApiFullData.setFullData($scope.defaultCrypto,$scope.defaultVal).then(function(fullData){
            $scope.currencies = fullData
        },function(error){
            $scope.Data = error
        })
    }
})

app.controller("statPannelChartCtrl",function ($scope, GetApiInfo){
 GetApiInfo.getHistoricalDay(["BTC"],["USD"]).then(function(response){
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



var app = angular.module("cryptoAnalytics", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {templateUrl:'app/inc/views/home.html'})
    .when('/currencies', {templateUrl:'app/inc/views/currencies.html', controller:'currenciesCtrl'})
    .when('/currencies/:symbol', {templateUrl:'app/inc/views/currency.html', controller:'currencyCtrl'})
    .when('/account', {templateUrl:'app/inc/views/account.html', controller:'accountCtrl'})
    .otherwise({redirectTo:'/'})

})

app.controller('currenciesCtrl', function($scope, ApiInfo){

    $scope.currencies = ApiInfo.getCryptoCurrency().then(function(response){
        $scope.currencies = response
    })

})

app.controller('connectionInscriptionCtrl', function($scope){
    //TO DO GESTION CONNECTION
})

app.controller('accountCtrl',function($scope){
    //TO DO GESTION DES PREFERENCES
})

app.controller('currencyCtrl', function($scope, $routeParams, ApiInfo, GetHistoricalInfo){
    $scope.name = ApiInfo.getCryptoCurrency().then(function(response){
        var output = []
        response.map(currency =>{
            output[currency.id_monnaie_crypto] = currency.nom_monnaie_crypto
        })
        $scope.name = output[$routeParams.symbol]
    })
    $scope.tradiCurrency = 'USD'
    $scope.symbol = $routeParams.symbol
    $scope.currency = ApiInfo.getFullData([$scope.symbol]).then(function(success){
        $scope.currency = success
    },function(error){
        $scope.currency = error
    })

    GetHistoricalInfo.getHistoricalDay([$routeParams.symbol],["USD"]).then(function(response){
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
     Highcharts.stockChart($routeParams.symbol, {

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
            text: $routeParams.symbol
        },

        series: [{
            type: 'candlestick',
            name: $routeParams.symbol,
            data: ohlc,
        }]
    })
 })



})


app.controller('searchCtrl', function ($scope, ApiInfo){
    $scope.Data = ApiInfo.getCryptoCurrency().then(function(success){
        $scope.Data = success
    }, function(error){
        $scope.Data = error
    })
})

app.controller("statBarCtrl",function ($scope, ApiInfo){
    //data preference ou data by default
    $scope.prefCryptoVal = ['BTC','LTC','ETH','EOS','XRP','BCH']
    $scope.prefTradiVal = ['USD']

    $scope.name = ApiInfo.getCryptoCurrency().then(function(response){
        var output = []
        response.map(currency =>{
            output[currency.id_monnaie_crypto] = currency.nom_monnaie_crypto
        })
        $scope.name = output
    })

    $scope.currencies = ApiInfo.getFullData($scope.prefCryptoVal).then(function(success){
        $scope.currencies = success
    },function(error){
        $scope.currencies = error
    })
})

app.controller("statPannelChartCtrl",function ($scope, GetHistoricalInfo){
    GetHistoricalInfo.getHistoricalDay(["BTC"],["USD"]).then(function(response){
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
        })
    })
})



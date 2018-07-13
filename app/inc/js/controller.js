var app = angular.module("cryptoAnalytics", ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {templateUrl:'app/inc/views/home.html'})
    .when('/currencies', {templateUrl:'app/inc/views/currencies.html', controller:'currenciesCtrl'})
    .when('/currencies/:symbol', {templateUrl:'app/inc/views/currency.html', controller:'currencyCtrl'})
    .when('/monCompte', {templateUrl:'app/inc/views/account.html', controller:'accountCtrl'})
    .otherwise({redirectTo:'/'})

})
/* MOCKUP ------------------------TO DO, TO FINISH, TO UNIT TESTING ---------------------------MOCKUP*/
app.factory('GetUserConnection', function($http,$q){
    var userConnection  = {
        isConnected:false,
        test: function(){
            userConnection.isConnected = true
        },
        connectMe: function($nigol,$pdm){
            var deferred = $q.defer()
            $http.get("URL DE TEST ").success(function(data,status){
                if(data.success === true){
                    userConnection.isConnected = true
                }else{
                    isConnected = false
                }
                deferred.resolve(data.Data)
            }).error(function(data,status){
                userConnection.isConnected = false
                deferred.reject("pas de connection")
            })
            return deferred.promise
        }

    }
    return userConnection

})

app.factory('GetApiInfo', function($http, $q){

    var apiInfo = {
        getFullData: function(fsyms, tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiPrice.php/?function=getPriceMultiFull&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject('pas de connection')
            })
            return deferred.promise
        },
        getSymbol: function(){
            var deferred = $q.defer()
            $http.get("app/inc/json/staticSearch.json").success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject('pas de connection')
            })
            return deferred.promise
        },
        getHistoricalDay: function(fsyms,tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiHistorical.php/?function=getHistoricalDay&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
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

app.controller('connectionInscriptionCtrl', function($scope,$rootScope, GetUserConnection){
    console.log($rootScope)
})

app.controller('accountCtrl',function($scope,GetUserConnection){
    
})

app.controller('currencyCtrl', function($scope, $routeParams, GetApiInfo){
    $scope.currencyData = GetApiInfo.getFullData($routeParams.symbol,["USD"]).then(function(response){
        $scope.currencyData = response
    },function(error){
        $scope.currencyData = error
    })
})


app.controller('searchCtrl', function ($scope, GetApiInfo, GetUserConnection){
    console.log("searchCtrl ---- ")
    console.log(GetUserConnection)
    $scope.symbols = GetApiInfo.getSymbol().then(function(response){
        $scope.symbols = response
    },function(error){
        $scope.symbols = error
    })
})

app.controller("statBarCtrl",function ($scope, GetApiInfo){

    $scope.defaultCrypto = ['BTC','LTC','ETH','EOS','XRP','BCH']
    $scope.defaultVal = ['USD']

    $scope.currencies = GetApiInfo.getFullData($scope.defaultCrypto,$scope.defaultVal).then(function(response){
        $scope.currencies = response
    },function(error){
        $scope.currencies = error
    })


});
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



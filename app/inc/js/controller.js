var app = angular.module("cryptoAnalytics", ["ngRoute", "ngResource"]);

app.config(function($routeProvider, $resourceProvider){
    $routeProvider
    .when('/', {templateUrl:'app/inc/views/home.html'})
    .when('/currencies', {templateUrl:'app/inc/views/currencies.html', controller:'currenciesCtrl'})
    .when('/currencies/:symbol', {templateUrl:'app/inc/views/currency.html', controller:'currencyCtrl'})
    .when('/connexion', {templateUrl:'app/inc/views/connexion.html', controller:'connectionInscriptionCtrl'})
    .when('/inscription', {templateUrl:'app/inc/views/inscription.html', controller:'connectionInscriptionCtrl'})
    .when('/account', {templateUrl:'app/inc/views/account.html', controller:'accountCtrl'})
    .when('/Privacy', {templateUrl:'app/inc/views/404.html',})
    .when('/404', {templateUrl:'app/inc/views/404.html',})
    .otherwise({redirectTo:'/404'})

})

app.controller('currenciesCtrl', function($scope, ApiInfo){


    $scope.tradiCurrency = 'USD'
    $scope.currencies = ApiInfo.getCryptoCurrency().then(function(response){
        $scope.currencies = response
        var output = []
        response.map(currency =>{
            output.push(currency.id_monnaie_crypto)
        })
        $scope.symbolArray = output
        $scope.infoCurrencies = ApiInfo.getFullData($scope.symbolArray).then(function(success){
            $scope.infoCurrencies = success
        },function(error){
            $scope.infoCurrencies = error
        })
    })




})

app.controller('connectionInscriptionCtrl', function($scope, $resource, UserService, $window, $rootScope){
    
    var service = UserService;
    $scope.users = null;
    $scope.connexionValues = {email: null, password: null};
    /*service.getUsers(function (users) {
        $scope.users = users;
    });*/
    $scope.newUser = {};

    $scope.addUserAndRedirect = function() {
        $scope.addUser();
        $window.location.href = '#/account';
    }
    $scope.addUser = function () {
        service.addNewUser($scope.newUser, function () {
            $scope.users.push($scope.newUser);
            $rootScope.currentUser = $scope.newUser;
        });
    }

    $scope.connect = function() {
        service.checkUser($scope.connexionValues.email, $scope.connexionValues.password)
            .then(function(user){
                if(user.email){
                    $rootScope.currentUser = user;
                    $window.location.href = '#/account';
                }
                else{
                    console.log('erreur');
                }
            })
    }
})

app.controller('accountCtrl', function ($scope, UserService, ApiInfo, $window) {

    var service = UserService;
    $scope.user = service.getCurrentUser();
    ApiInfo.getCryptoCurrency().then(function(success){
        $scope.symbols = success
    }, function(error){
        $scope.symbols = error
    })

    ApiInfo.setTradiCurrency().then(function(success){
        $scope.currencies = success
    })

    if(!$scope.user){
        $window.location.href = '#/connexion';
    }

    $scope.saveUser = function() {
        service.modifyUser($scope.user, function(){

        })
    }

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
        var ohlc = []
        var volume = []
        for(var i = 0; i<response.Data.length; i++){
            var stockObject = response.Data[i]
            var outputOhlc = [
            stockObject.time*1000,
            stockObject.close,
            stockObject.high,
            stockObject.low,
            stockObject.open
            ]
            var outputVolume = [
            stockObject.time*1000,
            stockObject.volumefrom
            ]
            ohlc.push(outputOhlc);
            volume.push(outputVolume);
        }
        var groupingUnits = [
        ['day',[1, 3, 6]],
        ['week',[1, 3, 6]],
        ['month',[1, 3, 6]], 
        ['year',null]]

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        })

        Highcharts.stockChart($routeParams.symbol, {

            rangeSelector: {
                selected: 1
            },

            credits:{
                enabled:true,
                href:"#/",
                text:"cryptoAnalytics"
            },

            title: {
                text: $routeParams.symbol
            },

            yAxis: [{
                startOnTick: false,
                endOnTick: false,
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

            navigator:{
                adaptToUpdatedData:false
            },

            plotOptions: {
                series: {
                    dataGrouping: {
                        units: groupingUnits
                    },
                    smoothed:true
                }
            },

            series: [{
                type: 'candlestick',
                name: 'AAPL',
                id: 'aapl',
                zIndex: 2,
                data: ohlc
            }, {
                type: 'column',
                name: 'Volume',
                id: 'volume',
                data: volume,
                yAxis: 1
            }, {
                type: 'vbp',
                linkedTo: 'aapl',
                params: {
                    volumeSeriesID: 'volume'
                },
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                }
            }, {
                type: 'sma',
                linkedTo: 'aapl',
                zIndex: 1,
                marker: {
                    enabled: false
                }
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

app.controller("statPannelChartCtrl",function ($scope, GetHistoricalInfo, $rootScope){

    let cryptos = ['BTC']
    if($rootScope.currentUser && $rootScope.currentUser.cryptos.length) cryptos = [$rootScope.currentUser.cryptos[0]];
    let currency = ['USD']
    if($rootScope.currentUser && $rootScope.currentUser.currency.length) currency = [$rootScope.currentUser.currency[0]];
    GetHistoricalInfo.getHistoricalDay(cryptos,currency).then(function(response){
        var ohlc = []
        var volume = []
        for(var i = 0; i<response.Data.length; i++){
            var stockObject = response.Data[i]
            var outputOhlc = [
            stockObject.time*1000,
            stockObject.close,
            stockObject.high,
            stockObject.low,
            stockObject.open
            ]
            var outputVolume = [
            stockObject.time*1000,
            stockObject.volumefrom
            ]
            ohlc.push(outputOhlc);
            volume.push(outputVolume);
        }
        var groupingUnits = [
        ['day',[1, 3, 6]],
        ['week',[1, 3, 6]],
        ['month',[1, 3, 6]], 
        ['year',null]]

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        })

        Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 1
            },

            title: {
                text: cryptos
            },

            credits:{
                enabled:true,
                href:"#/currencies/" + cryptos,
                text: cryptos + " - cryptoAnalytics"
            },

            yAxis: [{
                startOnTick: false,
                endOnTick: false,
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

            plotOptions: {
                series: {
                    dataGrouping: {
                        units: groupingUnits
                    },
                    smoothed:true
                }
            },

            series: [{
                type: 'candlestick',
                name: 'AAPL',
                id: 'aapl',
                zIndex: 2,
                data: ohlc
            }, {
                type: 'column',
                name: 'Volume',
                id: 'volume',
                data: volume,
                yAxis: 1
            }, {
                type: 'vbp',
                linkedTo: 'aapl',
                params: {
                    volumeSeriesID: 'volume'
                },
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                }
            }, {
                type: 'sma',
                linkedTo: 'aapl',
                zIndex: 1,
                marker: {
                    enabled: false
                }
            }]
        })
    })
})



    /*
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
                text: 'BTC'
            },

            series: [{
                type: 'candlestick',
                name: 'BTC',
                data: ohlc,
            }]
        })
    })
    */




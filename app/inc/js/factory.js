app.factory('GetUserConnection', function($http,$q){
    var userConnection  = {
        isConnected:false,
        testConnect: function(){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiCrypto.php").success(function(data,status){
                userConnection.isConnected = true
                deferred.resolve(data)
            }).error(function(data,status){
                userConnection.isConnected = false
                deferred.reject("pas de connection")
            })
            return deferred.promise
        }
    }
    return userConnection

})

app.factory('ApiCurrencies',function($http, $q){
    var apiCurrency = {
        flag:false,
        currency: {},
        getCurrency: function(){
            return apiCurrency.currency
        },
        setCurrency: function(){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiCrypto.php/?getCurrencies=true").success(function(data, status){
                apiCurrency.currency = data
                apiCurrency.flag = true
                deferred.resolve(data)
            }).error(function(data, status){
                apiCurrency.flag = false
                deferred.reject('pas de connection')
            })
            return deferred.promise
        }
    }   
    return apiCurrency
})

app.factory('ApiFullData', function($http, $q){
    var apiFullData = {
        flag: false,
        fullData:[],
        getFullData: function(){
            return apiFullData.fullData
        }, 
        setFullData: function(fsyms,tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiPrice.php/?function=getPriceMultiFull&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                apiFullData.flag = true 
                apiFullData.fullData = data.DISPLAY
                deferred.resolve(data.DISPLAY)
            }).error(function(data, status){
                deferred.reject('pas de connection')
            })
            return deferred.promise
        }
    }
    return apiFullData
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
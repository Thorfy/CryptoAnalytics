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

app.factory('ApiInfo', function($http, $q){

    var apiInfo = {

        /**************START PART CRYPTOCURRENCY IN BASE**********************/
        flagCryptoCurrency: false,
        cryptoCurrency: {},
        getCryptoCurrency: function(){
            var deferred = $q.defer()
            if(apiInfo.flagCryptoCurrency === true){
                deferred.resolve(apiInfo.cryptoCurrency)
            }else{
                apiInfo.setCurrency().then(function(success){
                    deferred.resolve(apiInfo.cryptoCurrency)
                },function(error){
                    deferred.reject(false)
                })
            }
            return deferred.promise
        },
        setCurrency: function(){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiCrypto.php/?getCurrencies=true").success(function(data, status){
                apiInfo.cryptoCurrency = data
                apiInfo.flagCryptoCurrency = true
                deferred.resolve(data)
            }).error(function(data, status){
                apiInfo.flagCryptoCurrency = false
                deferred.reject(false)
            })
            return deferred.promise
        },
        /**************END PART CRYPTOCURRENCY IN BASE**********************/

        /**************START PART TRADICURRENCY IN BASE**************/
        flagTradiCurrency:false,
        tradiCurrency: {},
        getTradiCurrency: function(){
            return apiTradiCurrency.flagTradiCurrency
        },
        setTradiCurrency: function(){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiCrypto.php/?getTradiCurrencies=true").success(function(data, status){
                apiTradiCurrency.tradiCurrency = data
                apiTradiCurrency.flagTradiCurrency = true
                deferred.resolve(data)
            }).error(function(data, status){
                apiTradiCurrency.flagTradiCurrency = false
                deferred.reject(false)
            })
            return deferred.promise
        },
        /**************END PART TRADICURRENCY IN BASE**********************/

        /**************START PART FULLINFO IN API**************/
        flagFullData: false,
        fullData:[],
        getFullData: function(cryptoArray){
            var deferred = $q.defer()
            if(apiInfo.flagFullData === true){
                var output = {}
                cryptoArray.map(value =>{
                    output[value] = apiInfo.fullData[value]
                })
                deferred.resolve(output)
            }else{
                var allCryptoId =[] 
                apiInfo.getCryptoCurrency().then(function(success){
                    for(let i = 0;i<success.length;i++){
                        allCryptoId.push(success[i].id_monnaie_crypto)
                    }
                    apiInfo.setFullData(allCryptoId,["USD"]).then(function(success){
                        var toResolve = apiInfo.getFullData(cryptoArray).then(function(response){
                            deferred.resolve(response)
                        },function(error){
                           deferred.reject(false)
                        })
                        
                    },function(error){
                        deferred.reject(false)
                    })
                })
            }
            return deferred.promise
        }, 
        setFullData: function(fsyms,tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiPrice.php/?function=getPriceMultiFull&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                apiInfo.flagFullData = true 
                apiInfo.fullData = data.DISPLAY
                deferred.resolve(data.DISPLAY)
            }).error(function(data, status){
                apiInfo.flagFullData = false 
                deferred.reject(false)
            })
            return deferred.promise
        }
        /**************END PART FULLINFO IN API**********************/
    }   
    return apiInfo



})

app.factory('GetHistoricalInfo', function($http, $q){

    var apiHistoricalInfo = {
        getFullData: function(fsyms, tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiPrice.php/?function=getPriceMultiFull&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject(false)
            })
            return deferred.promise
        },
        

        getHistoricalDay: function(fsyms,tsyms){
            var deferred = $q.defer()
            $http.get("cryptoAnaliticsApi/fonction_api/apiHistorical.php/?function=getHistoricalDay&fsyms="+fsyms.toString()+"&tsyms="+tsyms.toString()).success(function(data, status){
                deferred.resolve(data)
            }).error(function(data, status){
                deferred.reject(false)
            })
            return deferred.promise
        }

    }
    return apiHistoricalInfo    

})
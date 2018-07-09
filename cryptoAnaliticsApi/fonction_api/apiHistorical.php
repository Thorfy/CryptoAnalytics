<?php

require('../core/core.php');
/*
 * apiHistorical is a fonction of our api
 * This return actual price of 1 or multiple currency
 */

/*
 * api function getHistoricalDay
 * (string) params 1: cryptoCurrencySymbol;
 * (array) params 2: traditional currency;
 * (int) params 3: limit;
 * return jsonFlux of the result;
 */

function getHistoricalDay($fsym, $tsym, $iLimit = 100) {
    $sUrl = 'https://min-api.cryptocompare.com/data/histoday?fsym=' . $fsym . '&tsym=' . $tsym . '&limit=' . $iLimit;
    return buildCurl($sUrl);
}

/*
 * api function getHistoricalHour
 * (string) params 1: cryptoCurrencySymbol;
 * (array) params 2: traditional currency;
 * (int) params 2: limit;
 * return jsonFlux of the result;
 */

function getHistoricalHour($fsym, $tsym, $iLimit = 100) {
    $sUrl = 'https://min-api.cryptocompare.com/data/histohour?fsym=' . $fsym . '&tsym=' . $tsym . '&limit=' . $iLimit;
    return buildCurl($sUrl);
}

/*
 * api function getpriceHistorical
 * (string) params 1: cryptoCurrencySymbol;
 * (array) params 2: traditional currency;
 * (int) params 3: timestamp;
 * return jsonFlux of the result;
 */

function getPriceHistorical($fsym, $tsyms, $iTimestamp) {
    $sTSyms = implode(",", $tsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' . $fsym . '&tsyms=' . $sTSyms . '&ts=' . $iTimestamp;
    return buildCurl($sUrl);
}

// test zone: you just need to call this page and uncomment
/*
print_r(getHistoricalDay("BTC", "USD", 10));
print_r(getHistoricalHour("BTC", "USD", 10));
print_r(getpriceHistorical("BTC", array("USD", "EUR"), 1520617009));
*/
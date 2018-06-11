<?php

require('../core/core.php');
/*
 * apiPrice is a fonction of our api
 * This return actual price of 1 or multiple currency
 */

/*
 * api function getPrice
 * (string) params 1: cryptoCurrencySymbol;
 * (array) params 2: traditional currency;
 * return jsonFlux of the result;
 */

function getPrice($fsym, $tsyms) {
    $sTSyms = implode(",", $tsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' . $fsym . '&tsyms=' . $sTSyms;

    return buildCurl($sUrl);
}

/*
 * *api function getPrice
 * *(array) params 1: cryptoCurrencySymbol; (array) params 2: traditional currency
 * *return jsonFlux of the result
 */

function getPriceMulti($fsyms, $tsyms) {
    $sTSyms = implode(",", $tsyms);
    $sFSyms = implode(",", $fsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' . $sFSyms . '&tsyms=' . $sTSyms;

    return buildCurl($sUrl);
}

// test zone: you just need to call this page and uncomment
print_r(getPrice("BTC", array("USD", "EUR")));
print_r(getPriceMulti(array("BTC", "ETH"), array("USD", "EUR")));

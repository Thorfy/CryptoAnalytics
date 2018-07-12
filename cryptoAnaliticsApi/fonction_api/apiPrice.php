<?php

require('../core/core.php');
if ($_GET['function']) {
	$function = $_GET['function'];
	if($_GET['fsyms']){
		$fsyms = $_GET['fsyms'];
	}else{
		$fsyms = ["BTC"];
	}

	if($_GET['tsyms']){
		$tsyms = $_GET['tsyms'];
	}else{
		$tsyms = ["USD"];
	}
	echo var_export($fsyms."-".$tsyms,true);
	echo $function($fsyms, $tsyms);
}
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

function getPrice($fsyms, $tsyms) {
    $sTSyms = implode(",", (array)$tsyms);
    $sFSyms = implode(",", (array)$fsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/price?fsym=' . $sFSyms . '&tsyms=' . $sTSyms;

    return buildCurl($sUrl);
}

/*
 * *api function getPrice
 * *(array) params 1: cryptoCurrencySymbol; (array) params 2: traditional currency
 * *return jsonFlux of the result
 */

function getPriceMulti($fsyms, $tsyms) {
    $sTSyms = implode(",", (array)$tsyms);
    $sFSyms = implode(",", (array)$fsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' . $sFSyms . '&tsyms=' . $sTSyms;

    return buildCurl($sUrl);
}

/*
 * *api function getPriceMultiFull
 * *(array) params 1: cryptoCurrencySymbol; (array) params 2: traditional currency
 * *return jsonFlux of the result
 */

function getPriceMultiFull($fsyms, $tsyms) {
    $sTSyms = implode(",", (array)$tsyms);
    $sFSyms = implode(",", (array)$fsyms);
    $sUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' . $sFSyms . '&tsyms=' . $sTSyms;

    return buildCurl($sUrl);
}

// test zone: you just need to call this page and uncomment
/*
print_r(getPrice("BTC", array("USD", "EUR")));
print_r(getPriceMulti(array("BTC", "ETH"), array("USD", "EUR")));
*/
<?php
/* 
 * This file countain core function of our api
 */

/*
 * Building a simple https curl request
 */

function buildCurl($sUrl) {
    $curl = curl_init($sUrl);

    curl_setopt($curl, CURLOPT_FAILONERROR, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($curl);
    return $result;
}


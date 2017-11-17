<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

extract($_REQUEST);



if(!isset($currencypair)){
  $currencypair = 'ETHUSD';
}


if (strpos($currencypair, 'BTC') !== false) {
    $currencypair = 47;
}
if (strpos($currencypair, 'ETH') !== false) {
    $currencypair = 49;
}
if (strpos($currencypair, 'BCH') !== false) {
    echo('{"status":"fail", "msg":"This exchange does not support this currency pair"}');
    return;
}

if (strpos($currencypair, 'TAAS') !== false) {
    $currencypair = 86;
}

if (strpos($currencypair, 'ETC') !== false) {
    echo('{"status":"fail", "msg":"This exchange does not support this currency pair"}');
    return;
}

if(!isset($currencypair)){
  $currencypair = 47;
}



//https://liqui.io/market/depth?id=49

$resp = file_get_contents("https://www.liqui.io/market/depth?id=".$currencypair);

//$resp = file_get_contents("https://api.bitfinex.com/v2/candles/trade:".$period.":t".$currencypair."/hist?limit=".$limit);

$respArr = json_decode($resp, true);


$newArr = array();


	$newArr['bids'] = $respArr['Bids'];
	$newArr['asks'] = $respArr['Asks'];

$resp = json_encode($newArr);
echo($resp);

?>
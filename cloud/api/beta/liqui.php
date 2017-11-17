<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

extract($_REQUEST);


if(!isset($period)){
  $period = '1h';
}

switch($period){

  case "1m": 
    $period = 5;
   $limit = strtotime("-8 hour");
  break;

  case "5m": 
    $period = 5;

    $limit = strtotime("-8 hour");
  break;


  case "15m": 
    $period = 15;
     $limit = strtotime("-1 day");
  break;


  case "30m": 
    $period = 30;
     $limit = strtotime("-1 day");
  break;


  case "1h": 
    $period = 60;
      $limit = strtotime("-3 day");
  break;


  case "1D": 
    $period = 1440;
      $limit = strtotime("-2 week");
  break;


  case "7D": 
    $period = 8640;
      $limit = strtotime("-6 month");
  break;

  case "1M": 
    $period = 43200;
      $limit = strtotime("-2 year");
  break;


  default:
    $period = 60;
      $limit = strtotime("-3 day");
  break;
}


if(!isset($limit)){
   $limit = strtotime("-1 day");
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



$resp = file_get_contents("http://www.liqui.io/chart/history?symbol=".$currencypair."&resolution=".$period."&from=".$limit."&to=9999999999");
//echo($resp);



$respArr = json_decode($resp, true);

$respNew = $respArr;

$emptyArr = [];
for($i=0; $i<count($respNew['t']); $i++){
  $timestamp = $respNew['t'][$i] *1000;
  $open = $respNew['o'][$i];
  $close = $respNew['c'][$i];
  $high = $respNew['h'][$i];
  $low = $respNew['l'][$i];
  $volume = $respNew['v'][$i];

    $emptyArr[$i][0] = $timestamp;
  $emptyArr[$i][1] = $open;
  $emptyArr[$i][2] = $high;
  $emptyArr[$i][3] = $low;
  $emptyArr[$i][4] = $close;
  $emptyArr[$i][5] = $volume;


}


$resp = json_encode($emptyArr);
echo($resp);

?>
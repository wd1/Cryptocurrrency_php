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
    $period = 300;
   $limit = strtotime("-8 hour");
  break;

  case "5m": 
    $period = 300;

    $limit = strtotime("-8 hour");
  break;


  case "15m": 
    $period = 900;
     $limit = strtotime("-1 day");
  break;


  case "30m": 
    $period = 1800;
     $limit = strtotime("-1 day");
  break;


  case "1h": 
    $period = 7200;
      $limit = strtotime("-3 day");
  break;


  case "1D": 
    $period = 14400;
      $limit = strtotime("-2 week");
  break;


  case "7D": 
    $period = 86400;
      $limit = strtotime("-6 month");
  break;

  case "1M": 
    $period = 86400;
      $limit = strtotime("-2 year");
  break;


  default:
    $period = 300;
      $limit = strtotime("-1 day");
  break;
}


if(!isset($limit)){
   $limit = strtotime("-1 day");
}

if(!isset($currencypair)){
  $currencypair = 'ETHUSD';
}


$currencyPNew  = explode("US", $currencypair);
$currencypair ="USDT_" .$currencyPNew[0];



$resp = file_get_contents("https://poloniex.com/public?command=returnChartData&currencyPair=".$currencypair."&start=".$limit."&end=9999999999&period=".$period);




$respArr = json_decode($resp, true);

$respNew = $respArr;

$emptyArr = [];
for($i=0; $i<count($respNew); $i++){
  $timestamp = $respNew[$i]['date'] *1000;
  $open = $respNew[$i]['open'];
  $close = $respNew[$i]['close'];
  $high = $respNew[$i]['high'];
  $low = $respNew[$i]['low'];
  $volume = $respNew[$i]['volume'];

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
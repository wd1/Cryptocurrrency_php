<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

extract($_REQUEST);


if(!isset($period)){
  $period = '1h';
}

if(!isset($limit)){
  $limit = '100';
}

if(!isset($currencypair)){
  $currencypair = 'ETHUSD';
}




$resp = file_get_contents("https://api.bitfinex.com/v2/candles/trade:".$period.":t".$currencypair."/hist?limit=".$limit);

$respArr = json_decode($resp, true);

$respNew = array_reverse($respArr);

for($i=0; $i<count($respNew); $i++){

  $open = $respNew[$i][1];
  $close = $respNew[$i][2];
  $high = $respNew[$i][3];
  $low = $respNew[$i][4];

  $respNew[$i][1] = $open;
  $respNew[$i][2] = $high;
  $respNew[$i][3] = $low;
  $respNew[$i][4] = $close;

}


$resp = json_encode($respNew);
echo($resp);

?>
<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

extract($_REQUEST);



if(!isset($currencypair)){
  $currencypair = 'ETHUSD';
}


$resp = file_get_contents("https://api.bitfinex.com/v2/book/t".$currencypair."/P0?len=100");

//$resp = file_get_contents("https://api.bitfinex.com/v2/candles/trade:".$period.":t".$currencypair."/hist?limit=".$limit);

$respArr = json_decode($resp, true);

$respNew = $respArr;

$newArr = array("asks"=>array(), "bids"=>array());
for($i=0; $i<count($respNew); $i++){

  if($respNew[$i][2]<0){
    $pusher = [$respNew[$i][0], abs($respNew[$i][2])];
    array_push($newArr['asks'], $pusher);
  }
  else{
   $pusher = [$respNew[$i][0], abs($respNew[$i][2])];
     array_push($newArr['bids'], $pusher );
  }

}


$resp = json_encode($newArr);
echo($resp);

?>
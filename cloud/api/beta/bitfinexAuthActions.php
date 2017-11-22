<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

include_once("libs/Bitfinex.php");
extract($_REQUEST);

if(!isset($action)){

  echo('{"status":"fail", "msg": "please send action"}');
  return;

}


if(!isset($api_key)){

  echo('{"status":"fail", "msg": "please send api_key"}');
  return;

}

if(!isset($api_secret)){

  echo('{"status":"fail", "msg": "please send api_secret"}');
  return;

}



$bfx = new Bitfinex($api_key, $api_secret);

$amount = 0.01;
$price = 20.00;


//var_dump($bfx->get_symbols());


switch($action){


  case "myinfo":
    $resp =  $bfx-> get_account_infos();

  break;

  case "sell":
   $resp =  $bfx-> new_order("ltcusd", "0.2", "74.00", "bitfinex", "sell", "exchange limit", FALSE, FALSE, FALSE, NULL);


  break;

  case "myorders":
      $resp =  $bfx->get_orders();
  break;

  case "cancelorder":
    if(!isset($orderId)){

      echo('{"status":"fail", "msg": "please send orderId"}');
      return;

    }   
    $orderId = intval($orderId);
      $resp =  $bfx->cancel_order($orderId);
  break;

  default:
     $resp =  $bfx-> get_account_infos();
  break;

}



echo(json_encode($resp, true));

?>
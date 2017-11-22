<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

include_once("libs/db.php");
include_once("libs/balancesLib.php");
extract($_REQUEST);


session_start();

if(isset($oauth)){
	$_SESSION['oauth'] = $oauth;
}



if(!isset($_SESSION['oauth']) && !isset($oauth)){
		$_SESSION['oauth']=  genRand();
	
		
}
if(!isset($oauth)){
	$oauth = $_SESSION['oauth'];
}



$userInfo = dbMassData("SELECT * FROM  users WHERE oauth = '$oauth'");
if($userInfo == NULL){
	  echo('{"status":"fail", "msg": "oauth invalid"}');
  return;
}
else{
	$_SESSION['userId'] = $userInfo[0]['rId'];
}




if(!isset($_SESSION['userId'])){
		$_SESSION['userId']=  genRand();
		$_SESSION['guestUser']=  true;

		dbQuery("INSERT INTO users (email, oauth) VALUES ('guestuser', '$oauth')");

}




$userId = $_SESSION['userId'];

if(!isset($symbol)){

  echo('{"status":"fail", "msg": "please send symbol"}');
  return;

}

$symbol = strtolower($symbol);

if(!isset($price)){

  echo('{"status":"fail", "msg": "please send price"}');
  return;

}


if(!isset($amount)){

  echo('{"status":"fail", "msg": "please send amount"}');
  return;

}

if(!isset($price)){

  echo('{"status":"fail", "msg": "please send price"}');
  return;

}


if(!isset($type)){

  echo('{"status":"fail", "msg": "please send type.. buy or sell"}');
  return;

}

if(floatval($amount) < 0){
	echo('{"status":"fail", "msg": "Please send a positive number"}');
  return;
}

if(floatval($price) < 0){
	echo('{"status":"fail", "msg": "Please send a positive number"}');
  return;
}

$stat = 'opened';




$amount = floatval($amount);
$price = floatval($price);


$orderSize = $amount*$price;

if($type == "buy"){


	$orderInfo = dbMassData("SELECT * FROM users WHERE oauth ='$oauth'");
	if($orderInfo[0]['mockbalance'] < $orderSize){
			  echo('{"status":"fail", "msg": "you dont have enough. Your mock balance is '.$orderInfo[0]['mockbalance'].'"}');
			  return;
	}

	
}

if($type == "sell"){


	$orderInfo = dbMassData("SELECT * FROM mockorders WHERE oauth ='$oauth' AND symbol ='$symbol' AND status != 'cancelled'");
	

	if($orderInfo == NULL){
			 echo('{"status":"fail", "msg": "You dont have enough  '.$symbol.' to sell '.$amount.' of it"}');
			  return;
	}

	$symBalance = 0;
	for($i=0; $i<count($orderInfo); $i++){

		if($orderInfo[$i]['type'] == "sell"){
			$symBalance = $symBalance - $orderInfo[$i]['amount'];
		}

		if($orderInfo[$i]['type'] == "buy"){
			$symBalance = $symBalance + $orderInfo[$i]['amount'];
		}
	}


	if($symBalance < floatval($amount)){
		 echo('{"status":"fail", "msg": "You dont have enough  '.$symbol.' to sell '.$amount.' of it. You have '.$symBalance.' and you are trying to sell '.$amount.' currently. This figure deducts assets currently in active orders."}');
			  return;
	}
}
	

		// see if their order is close enough to market to mock-fill

		$apiAns = file_get_contents('https://api.cryptonator.com/api/ticker/'.strtoupper($symbol) .'-USD');

		$ans = json_decode($apiAns,true);

		$convertPrice = $ans['ticker']['price'];
		
		$buyableOrderSize = $orderSize - ($orderSize * .02); //0 to make it go by strict market... bad as their are flucts

		$sellableOrderSize = $orderSize + ($orderSize * .02);

		if($type == "sell"){


			if($convertPrice * $amount >= $buyableOrderSize){
				$stat = 'filled';
				dbQuery("INSERT INTO mockorders (symbol, price, amount, exchange, oauth, type, status) VALUES ('$symbol', $price, $amount, 'proofmock', '$oauth', 'sell', 'filled')");

			}
			else{

				dbQuery("INSERT INTO mockorders (symbol, price, amount, exchange, oauth, type, status) VALUES ('$symbol', $price, $amount, 'proofmock', '$oauth', 'sell', 'opened')");
			
			}

			$orderInfo = dbMassData("SELECT * FROM users WHERE oauth ='$oauth'");
			$oldBalance = $orderInfo[0]['mockbalance'];
			$newBalance = $oldBalance + $orderSize;

			dbQuery("UPDATE users SET mockbalance = $newBalance WHERE oauth = '$oauth'");
		}

		else{

			if($convertPrice * $amount <= $sellableOrderSize){
				$stat= 'filled';
				dbQuery("INSERT INTO mockorders (symbol, price, amount, exchange, oauth, type, status) VALUES ('$symbol', $price, $amount, 'proofmock', '$oauth', 'buy', 'filled')");
			}
			else{
				dbQuery("INSERT INTO mockorders (symbol, price, amount, exchange, oauth, type, status) VALUES ('$symbol', $price, $amount, 'proofmock', '$oauth', 'buy', 'opened')");
			}

			$orderInfo = dbMassData("SELECT * FROM users WHERE oauth ='$oauth'");
			$oldBalance = $orderInfo[0]['mockbalance'];
			$newBalance = $oldBalance - $orderSize;

			dbQuery("UPDATE users SET mockbalance = $newBalance WHERE oauth = '$oauth'");


		}

		

$latestOrders= dbMassData("SELECT * FROM mockorders WHERE oauth = '$oauth' ORDER BY timestamp DESC LIMIT 1");

	 echo('{"status":"success", "msg": "Your order has been '.$stat.'", "data":'.json_encode($latestOrders[0]).', "balanceInfo": '.json_encode(getUserBalance($oauth)).', "filledStatus":"'.$stat.'"}');
			  return;












function genRand() {
	$length = 10;
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


?>
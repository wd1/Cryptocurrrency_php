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


if(!isset($_SESSION['oauth'])){
	session_id();
	session_start();
		$_SESSION['oauth']=  genRand();
	
		
}
$oauth = $_SESSION['oauth'];

$realUser = false;

$exists = dbMassData("SELECT * FROM users WHERE oauth ='$oauth'");

if($exists != NULL){
	$_SESSION['userId'] = $exists[0]['rId'];
}

if(!isset($_SESSION['userId'])){

		$_SESSION['userId']=  genRand();
		$_SESSION['guestUser']=  true;
		
		if($exists == null){
			dbQuery("INSERT INTO users (email, oauth) VALUES ('guestuser', '$oauth')");
		}
		

}


if($exists[0]['email'] != NULL && $exists[0]['email'] !='' && $exists[0]['email'] !='guestuser' ){
	$realUser=true;
}
else{
	$realUser=false;
}

	


$usersOrders= dbMassData("SELECT * FROM mockorders WHERE oauth = '$oauth' AND status = 'opened'");

$usersInfo = dbMassData("SELECT * FROM users WHERE oauth = '$oauth'");

$oldBalance = $usersInfo[0]['mockbalance'];
$newBalance = $oldBalance;
for($i=0; $i<count($usersOrders); $i++){


	$symbol = $usersOrders[$i]['symbol'];

		// see if their order is close enough to market to mock-fill

		$apiAns = file_get_contents('https://api.cryptonator.com/api/ticker/'.strtoupper($symbol) .'-USD');

		$ans = json_decode($apiAns,true);

		$convertPrice = $ans['ticker']['price'];

		$type= $usersOrders[$i]['type'];
		$price= $usersOrders[$i]['price'];
		$amount =$usersOrders[$i]['amount'];
		$oldBalance = $newBalance;
		if($type == "sell"){

			if($price >= $convertPrice){
				dbQuery("UPDATE mockorders SET status = 'filled' WHERE rId = $orderId");
				$tradeSize = $price*$amount;
				$newBalance = $oldBalance + $tradeSize;
				dbQuery("UPDATE users SET mockbalance = $newBalance WHERE oauth = '$oauth'");

			}
		}
		else{

			if($price <= $convertPrice){
				dbQuery("UPDATE mockorders SET status = 'filled' WHERE rId = $orderId");
				$tradeSize = $price*$amount;
				$newBalance = $oldBalance - $tradeSize;
				dbQuery("UPDATE users SET mockbalance = $newBalance WHERE oauth = '$oauth'");

			}


		}
}


if($realUser ==true){
	$resp = array("balance"=>$newBalance, "user"=>$usersInfo, "orders"=>$usersOrders, "status"=>"success", "balanceInfo"=>getUserBalance($oauth));
}

else{
	$resp = array("balance"=>$newBalance, "user"=>$usersInfo, "orders"=>$usersOrders, "status"=>"fail", "balanceInfo"=>getUserBalance($oauth));
}


echo(json_encode($resp));





		












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
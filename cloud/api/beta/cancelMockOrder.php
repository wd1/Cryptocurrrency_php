<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

include_once("libs/db.php");
extract($_REQUEST);


session_start();

if(isset($oauth)){
	$_SESSION['oauth'] = $oauth;
}



if(!isset($_SESSION['oauth'])){
		 echo('{"status":"fail", "msg": "You must be logged in to do this, at least as guest user. How did you even get here?"}');
  return;
	
		
}
$oauth = $_SESSION['oauth'];







if(!isset($orderId)){

  echo('{"status":"fail", "msg": "please send orderId"}');
  return;

}



$theOrder = dbMassData("SELECT * FROM mockorders WHERE oauth = '$oauth' AND rId = $orderId");

if($theOrder == NULL){
	 echo('{"status":"fail", "msg": "This order number does not exist for the current user"}');

  return;
}
else{

	$price =$theOrder[0]['price'];
	$amount =$theOrder[0]['amount'];
	$orderSize = $price*$amount;

	$userInfo = dbMassData("SELECT * FROM users WHERE oauth = '$oauth'");
	$oldBalance = $userInfo[0]['mockbalance'];

	$newBalance = $oldBalance+ $orderSize;

	dbQuery("UPDATE mockorders SET status = 'cancelled' WHERE rId = $orderId");
	$theOrders = dbMassData("SELECT * FROM mockorders WHERE oauth = '$oauth' AND status !='cancelled'");
	dbQuery("UPDATE users SET mockbalance = $newBalance WHERE oauth = '$oauth'");
	$resp = array("status"=>"success", "data"=> $theOrders, "balance"=>$newBalance);

	


	echo(json_encode($resp));


}

?>
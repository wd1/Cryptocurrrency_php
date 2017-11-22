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
		$_SESSION['oauth']=  genRand();
	
		
}
$oauth = $_SESSION['oauth'];


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




$cryptosHeld = array();
$cryptoValue = 0;
//pendingUSD is amount of USD held up in orders
$portfolio = array("USDBalance"=>25000, "pendingUSD"=>0, "cryptocurrencies"=>array(), "pendingCryptoCurrencies"=>array(), "cryptoValue"=>0, "totalAssets"=>0);


$allUserOrders = dbMassData("SELECT * FROM mockorders WHERE status !='cancelled' AND oauth ='$oauth' ORDER BY timestamp ASC");

for($i=0; $i<count($allUserOrders); $i++){

	$order = $allUserOrders[$i];
	if($order['status'] == "opened"){

		//doing pending balance
		if($order['type']=="sell"){
			//add to pendingCryptoCurrencies
			//subtract from cryptocurrencies

			if(!isset($portfolio['pendingCryptoCurrencies'][$order['symbol']])){
				$portfolio['pendingCryptoCurrencies'][$order['symbol']] = $order['amount'];
				$portfolio['cryptocurrencies'][$order['symbol']]= (0 - $order['amount']);

			}
			else{
				$portfolio['pendingCryptoCurrencies'][$order['symbol']] = $portfolio['pendingCryptoCurrencies'][$order['symbol']] + $order['amount'];
				$portfolio['cryptocurrencies'][$order['symbol']] = $portfolio['cryptocurrencies'][$order['symbol']] - $order['amount'];
			}
		}
		if($order['type']=="buy"){

			//add to pendingUSD
			//subtract from USD Balance

			$portfolio['pendingUSD'] = $portfolio['pendingUSD'] + ($order['price'] *$order['amount']);
			$portfolio['USDBalance'] = $portfolio['USDBalance'] - ($order['price'] *$order['amount']);

		}
	}



	if($order['status']=="filled"){

		//doing balance

		if($order['type']=="sell"){
			//add to USD Balance
			//subtract from crypto balance
			$portfolio['USDBalance'] = $portfolio['USDBalance'] + ($order['price'] *$order['amount']);

			if(!isset($portfolio['cryptocurrencies'][$order['symbol']])){
				$portfolio['cryptocurrencies'][$order['symbol']] =(0 -  $order['amount']);

			}
			else{
				$portfolio['cryptocurrencies'][$order['symbol']] = $portfolio['cryptocurrencies'][$order['symbol']] -  $order['amount'];
			}


		}
		if($order['type']=="buy"){
			// subtract from USD balance
			//add to cryptocurrency balance

			$portfolio['USDBalance'] = $portfolio['USDBalance'] - ($order['price'] *$order['amount']);
			if(!isset($portfolio['cryptocurrencies'][$order['symbol']])){
				$portfolio['cryptocurrencies'][$order['symbol']] = $order['amount'];
				array_push($cryptosHeld, $order['symbol']);

			}
			else{

				$portfolio['cryptocurrencies'][$order['symbol']] = $portfolio['cryptocurrencies'][$order['symbol']] +  $order['amount'];
				
			}


		}


	}
}


for($i =0; $i<count($cryptosHeld); $i++){

	//get current price for crypto
		$apiAns = file_get_contents('https://api.cryptonator.com/api/ticker/'.strtoupper($cryptosHeld[$i]) .'-USD');

		$ans = json_decode($apiAns,true);

		$convertPrice = $ans['ticker']['price'];

		$usersValue = floatval($portfolio['cryptocurrencies'][$cryptosHeld[$i]]) *floatval($convertPrice);
		
		$cryptoValue = $cryptoValue+ $usersValue;
		//echo($cryptoValue);

}

$portfolio['cryptoValue'] = $cryptoValue;
$portfolio['totalAssets'] = $cryptoValue + $portfolio['USDBalance'];

echo(json_encode($portfolio));











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
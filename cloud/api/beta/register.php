<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

include_once("libs/db.php");
extract($_REQUEST);



if(!isset($email)){

  echo('{"status":"fail", "msg": "please send email"}');
  return;

}

if(!isset($pw)){

  echo('{"status":"fail", "msg": "please send pw"}');
  return;

}


$exists = dbMassData("SELECT * FROM users WHERE email = '$email'");

if($exists !=NULL){
	echo('{"status":"fail", "msg": "email exists"}');
  return;
}

$newPass = md5($pw);

session_start();


if(isset($oauth)){
  $_SESSION['oauth'] = $oauth;
}

if(!isset($_SESSION['oauth'])){
  session_id();
  session_start();
  $oauth = genRand();
  dbQuery("INSERT INTO users (email, pw, oauth) VALUES ('$email', '$newPass', '$oauth') ");

  $userInfo = dbMassData("SELECT * FROM users WHERE email = '$email'");
$_SESSION['userId']=  $userInfo[0]['rId'];
$_SESSION['email'] =  $userInfo[0]['email'];
$_SESSION['oauth'] =  $oauth;
$_SESSION['guestUser'] =  false;
$_SESSION['status'] =  "success";
echo(json_encode($_SESSION));

}
else{
   dbQuery("UPDATE users SET email = '$email', pw = '$newPass' WHERE oauth='$oauth'");
  $oauth = $_SESSION['oauth'];
    $userInfo = dbMassData("SELECT * FROM users WHERE oauth = '$oauth'");
$_SESSION['userId']=  $userInfo[0]['rId'];
$_SESSION['email'] =  $userInfo[0]['email'];
$_SESSION['oauth'] =  $oauth;
$_SESSION['guestUser'] =  false;
$_SESSION['status'] =  "success";
echo(json_encode($_SESSION));

 
}











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
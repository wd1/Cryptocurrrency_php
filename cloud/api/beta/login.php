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

if($exists ==NULL){
	echo('{"status":"fail", "msg": "Email does not exist"}');
  return;
}

$newPass = md5($pw);

$exists = dbMassData("SELECT * FROM users WHERE email = '$email' AND pw = '$newPass'");

if($exists ==NULL){
	echo('{"status":"fail", "msg": "Incorrect password/email pair"}');
  return;
}

session_id();
session_start();

$userInfo = dbMassData("SELECT * FROM users WHERE email = '$email'");
$_SESSION['userId']=  $userInfo[0]['rId'];
$_SESSION['email'] =  $userInfo[0]['email'];
$_SESSION['oauth'] =  $userInfo[0]['oauth'];
$_SESSION['mockbalance'] =  $userInfo[0]['mockbalance'];
$_SESSION['guestUser'] =  false;
$_SESSION['status'] =  "success";

echo(json_encode($_SESSION));





?>
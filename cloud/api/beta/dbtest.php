<?php

//include_once($_SERVER['DOCUMENT_ROOT'].'//cloud/models/beta/index.php');
//echo($_SERVER['DOCUMENT_ROOT'].'/cloud/models/beta/index.php');

header('Access-Control-Allow-Methods: GET, POST'); 


header('Access-Control-Allow-Origin: *');

include_once("libs/db.php");
extract($_REQUEST);



$resp = dbMassData("SELECT * FROM users");

echo("ok<br>");

print_r($resp);

echo("<br>finish");

?>
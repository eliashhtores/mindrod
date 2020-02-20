<?php

$host = "127.0.0.1";
$user = "mindrod";
$password = "lAuIN0F05eki3YqD";
$database = "mindrod";

try {
    $dbh = new PDO("mysql:host=$host;dbname=$database", $user, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
} catch (PDOException $e) {
    echo $e->getMessage();
}

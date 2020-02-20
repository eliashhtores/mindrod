<?php
require_once('connect.php');

ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();

$year = $_GET['year'];
$month = $_GET['month'];

$sth = $dbh->query("SELECT * FROM work_order WHERE YEAR(receipt_date) = $year AND MONTH(receipt_date) = $month AND status >= 0");
$result = $sth->fetchAll(PDO::FETCH_ASSOC);
$result = json_encode($result);
echo $result;
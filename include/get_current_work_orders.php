<?php
require_once('connect.php');

$month = date('m');
$year = date('Y');
$sth = $dbh->query("SELECT COUNT(*) AS current FROM work_order WHERE YEAR(receipt_date) = $year AND MONTH(receipt_date) = $month AND status >= 0");
$results = $sth->fetch();

$results = json_encode($results);
echo $results;

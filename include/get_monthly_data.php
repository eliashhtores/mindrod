<?php
require_once('connect.php');

$year = date('Y');
$months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

foreach ($months as $key=> $month) {
    $key++;
    $sth = $dbh->query("SELECT MONTH(receipt_date) AS month, 
    SUM(CASE WHEN indicator = 'AT' THEN 1 ELSE 0 END) AS early,
    SUM(CASE WHEN indicator = 'ET' THEN 1 ELSE 0 END) AS on_time,
    SUM(CASE WHEN indicator = 'FT' THEN 1 ELSE 0 END) AS out_of_time,
    SUM(CASE WHEN rework = 'R' THEN 1 ELSE 0 END) AS reworks,
    COUNT(*) AS total
    FROM work_order
    WHERE YEAR(receipt_date) = $year
        AND status >= 0
    GROUP BY 1");
}
$results = $sth->fetchAll(PDO::FETCH_ASSOC);
$results = json_encode($results);
echo $results;

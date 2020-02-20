<?php
require_once('connect.php');

$id = $_GET['id'];
$sth = $dbh->query("SELECT * FROM work_order
WHERE id = $id");
$sth->execute();
$result = $sth->fetch(PDO::FETCH_ASSOC);

if ($sth->rowCount() !== 1) {
    exit("FALSE");
} else {
    $result = json_encode($result);
    echo $result;
}

<?php
require_once('connect.php');
require_once('auth.php');
session_start();

$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

if ($decoded) {
    $sth = $dbh->prepare("SELECT current_folio + 1 FROM folio");
    $sth->execute();
    $folio = $sth->fetch();

    $user_id = $_SESSION['id'];
    $client  = $decoded['client'];
    $commitment_date  = $decoded['commitment_date'];
    $description = $decoded['description'];
    $dwg_number  = $decoded['dwg_number'];
    $invoice  = $decoded['invoice'];
    $machine  = $decoded['machine'];
    $observations = $decoded['observations'];
    $quantity  = $decoded['quantity'];
    $receipt_date  = $decoded['receipt_date'];
    $serial  = $decoded['serial'];
    $work_order_number  = $decoded['work_order_number'];

    $sth = $dbh->prepare("INSERT INTO work_order(invoice, work_order_number, folio, dwg_number, description, client, machine, quantity, serial, receipt_date, commitment_date, observations, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $params = array($invoice, $work_order_number, $folio[0], $dwg_number, $description, $client, $machine, $quantity, $serial, $receipt_date, $commitment_date, $observations, $user_id);

    $sth_updateFolio = $dbh->prepare("UPDATE folio SET current_folio = current_folio + 1");
    $sth_updateFolio->execute();

    if ($sth->execute($params)) {
        $result = array("created"=>"True");
    } else {
        $result = array("created"=>"False");
    }
    echo json_encode($result);
}
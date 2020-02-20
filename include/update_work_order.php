<?php
require_once('connect.php');
ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();

if($_POST) {
  $user_id = $_SESSION['id'];
  $id = $_POST['id'];
  $invoice = $_POST['invoice'];
  $work_order_number = $_POST['work_order_number'];
  $dwg_number = $_POST['dwg_number'];
  $description = $_POST['description'];
  $client = $_POST['client'];
  $machine = $_POST['machine'];
  $quantity = $_POST['quantity'];
  $serial = $_POST['serial'];
  $receipt_date = $_POST['receipt_date'];
  $commitment_date = $_POST['commitment_date'];
  $due_date = $_POST['due_date'];
  $rework = $_POST['rework'];
  $indicator = $_POST['indicator'];
  $machinist = $_POST['machinist'];
  $status = $_POST['status'];
  $observations = $_POST['observations'];
  $row_color = $_POST['row_color'];

  $sth = $dbh->query("SELECT description
  FROM role
  JOIN user ON (user.role_id = role.id)
  WHERE user.id = '$user_id'");
  $sth->execute();
  $result = $sth->fetch(PDO::FETCH_ASSOC);
  
  if ($result['description'] == 'administrator') {
    $receipt_date == '' ? $receipt_date = 'NULL' : $receipt_date = "'$receipt_date'";
    $commitment_date == '' ? $commitment_date = 'NULL' : $commitment_date = "'$commitment_date'";
    $update_work_order = "UPDATE work_order
    SET invoice = '$invoice', work_order_number = '$work_order_number', dwg_number = '$dwg_number', description = '$description',
    client = '$client', machine = '$machine', quantity = $quantity, serial = '$serial', receipt_date = $receipt_date, commitment_date = $commitment_date,
    observations = '$observations', row_color = '$row_color', updated_by = '$user_id'
    WHERE id = ?";
  } else if ($result['description'] == 'metrology') { 
    $update_work_order = "UPDATE work_order
    SET rework = '$rework', observations = '$observations', row_color = '$row_color',
    updated_by = '$user_id'
    WHERE id = ?";
  } else {
    $due_date == '' ? $due_date = 'NULL' : $due_date = "'$due_date'";
    $update_work_order = "UPDATE work_order
    SET indicator = '$indicator', machinist = '$machinist', status = '$status', due_date = $due_date, observations = '$observations',
    row_color = '$row_color', updated_by = '$user_id'
    WHERE id = ?";
  }
  $statement_update_work_order = $dbh->prepare($update_work_order);
  $statement_update_work_order->execute(array($id));

  if ($statement_update_work_order->execute(array($id))) {
    $result = array("updated"=>"True");
  } else {
      $result = array("updated"=>"False");
  }
  echo json_encode($result);
}
<?php
require_once('connect.php');
session_start();

if($_POST) {
    $user_id = $_SESSION['id'];
    $id = $_POST['id'];
  
    $deactivate_work_order = "UPDATE work_order
    SET status = -1, updated_by = ?
    WHERE id = ?";

    $statement_deactivate_work_order = $dbh->prepare($deactivate_work_order);

    if ($statement_deactivate_work_order->execute(array($user_id, $id))) {
    $result = array("updated"=>"True");
    } else {
        $result = array("updated"=>"False");
    }
    echo json_encode($result);
}
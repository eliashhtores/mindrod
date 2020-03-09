<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/WorkOrder.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate work order object
  $workOrder = new WorkOrder($db);

  // Get years
  try {
    $workOrder->load_years();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  } 

  // Create array
  $years = $workOrder->years;

  // Make JSON
  print_r(json_encode($years));

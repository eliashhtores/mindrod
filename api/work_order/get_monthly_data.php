<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/WorkOrder.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $workOrder = new WorkOrder($db);

  $workOrder->year = isset($_GET['year']) ? $_GET['year'] : NULL;

  // Get monthly data
  try {
    $workOrder->get_monthly_data();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  } 

  // Create array
  $workOrder_arr = array(
    'data' => $workOrder->data
  );

  // Make JSON
  print_r(json_encode($workOrder_arr));

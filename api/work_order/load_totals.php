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

  // Get data
  $workOrder->monthQuery = '';
  $workOrder->rowColorQuery = '';
  
  if (isset($_GET['month'])) {
    $workOrder->month = $_GET['month'];  
    foreach($workOrder->month as &$value){
       $value = "'$value'";
    }
    $workOrder->month = implode(",", $workOrder->month);
    $workOrder->monthQuery = "AND MONTH(receipt_date) IN ($workOrder->month)";
  }

  if (isset($_GET['row_color'])) {
    $workOrder->row_color = $_GET['row_color'];  
    foreach($workOrder->row_color as &$value){
       $value = "'$value'";
    }
    $workOrder->row_color = implode(",", $workOrder->row_color);
    $workOrder->rowColorQuery = "AND row_color IN ($workOrder->row_color)";
  }

  $workOrder->month = isset($_GET['month']) ? $_GET['month'] : NULL;
  $workOrder->row_color = isset($_GET['row_color']) ? $_GET['row_color'] : NULL;
  $workOrder->year = isset($_GET['year']) ? $_GET['year'] : NULL;

  // echo $workOrder->monthQuery;

  // Get Work order
  try {
    $workOrder->load_totals();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  } 

  // Create array
  $workOrder_arr = array(
    'early' => $workOrder->early,
    'onTime' => $workOrder->onTime,
    'outOfTime' => $workOrder->outOfTime,
    'reworks' => $workOrder->reworks,
    'average' => $workOrder->average,
    'total' => $workOrder->total,
    'month_count' => count($workOrder->month)
  );

  // Make JSON
  print_r(json_encode($workOrder_arr));

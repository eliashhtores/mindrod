<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/WorkOrder.php';
  require_once('../../include/auth.php');

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog work order object
  $workOrder = new WorkOrder($db);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  $workOrder->invoice = $data->invoice;
  $workOrder->work_order_number = $data->work_order_number;
  $workOrder->dwg_number = $data->dwg_number;
  $workOrder->description = $data->description;
  $workOrder->client = $data->client;
  $workOrder->machine = $data->machine;
  $workOrder->quantity = $data->quantity;
  $workOrder->serial = $data->serial;
  $workOrder->receipt_date = $data->receipt_date;
  $workOrder->commitment_date = $data->commitment_date;
  $workOrder->observations = $data->observations;
  $workOrder->created_by = $user_id = $_SESSION['id'];

  // Create work order
  try {
    $workOrder->create();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  }

  echo json_encode(
    array('message' => 'Work order created',
          'result' => $workOrder)
    );

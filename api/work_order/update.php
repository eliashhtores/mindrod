<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/WorkOrder.php';
  require_once('../../include/auth.php');

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $workOrder = new WorkOrder($db);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  // Set properties to update
  $workOrder->id = $data->id;
  $workOrder->invoice = isset($data->invoice) ? $data->invoice : '';
  $workOrder->work_order_number = isset($data->work_order_number) ? $data->work_order_number : '';
  $workOrder->dwg_number = isset($data->dwg_number) ? $data->dwg_number : '';
  $workOrder->description = isset($data->description) ? $data->description : '';
  $workOrder->client = isset($data->client) ? $data->client : '';
  $workOrder->machine = isset($data->machine) ? $data->machine : '';
  $workOrder->quantity = isset($data->quantity) ? $data->quantity : '';
  $workOrder->serial = isset($data->serial) ? $data->serial : '';
  $workOrder->receipt_date = isset($data->receipt_date) ? $data->receipt_date : NULL;
  $workOrder->commitment_date = isset($data->commitment_date) ? $data->commitment_date : NULL;
  $workOrder->due_date = isset($data->due_date) ? $data->due_date : NULL; 
  $workOrder->description = isset($data->description) ? $data->description : '';
  $workOrder->rework = isset($data->rework) ? $data->rework : '';
  $workOrder->indicator = isset($data->indicator) ? $data->indicator : '';
  $workOrder->machinist = isset($data->machinist) ? $data->machinist : '';
  $workOrder->status = isset($data->status) ? $data->status : '';
  $workOrder->observations = isset($data->observations) ? $data->observations : '';
  $workOrder->row_color = isset($data->row_color_single) ? $data->row_color_single : '';
  $workOrder->pdf = isset($data->pdf) ? $data->pdf : '';
  $workOrder->updated_by = $_SESSION['id'];

  // Update Work order
  try {
    $workOrder->update();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  } 

  $workOrder->read_single();
  echo json_encode(
    array('message' => 'Work order updated',
          'spanish' => 'Orden de trabajo actualizada.',
          'result' => $workOrder)
  );
 
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

  // Set ID to update
  $workOrder->id = $data->id;
  $workOrder->updated_by = $_SESSION['id'];

  // Update Work order
  if($workOrder->deactivate_work_order()) {
    echo json_encode(
      array('message' => 'Work order updated',
            'result' => $workOrder)
    );
  } else {
    echo json_encode(
      array('message' => 'Work order not updated')
    );
  }


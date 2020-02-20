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

  // Get ID
  $workOrder->id = isset($_GET['id']) ? $_GET['id'] : die();

  // Get Work order
  $workOrder->read_single();

  // Create array
  $workOrder_arr = array(
    'id' => $workOrder->id,
    'invoice' => $workOrder->invoice,
    'work_order_number' => $workOrder->work_order_number,
    'folio' => $workOrder->folio,
    'dwg_number' => $workOrder->dwg_number,
    'description' => $workOrder->description,
    'client' => $workOrder->client,
    'machine' => $workOrder->machine,
    'quantity' => $workOrder->quantity,
    'serial' => $workOrder->serial,
    'receipt_date' => $workOrder->receipt_date,
    'commitment_date' => $workOrder->commitment_date,
    'due_date' => $workOrder->due_date,
    'rework' => $workOrder->rework,
    'indicator' => $workOrder->indicator,
    'machinist' => $workOrder->machinist,
    'status' => $workOrder->status,
    'observations' => $workOrder->observations,
    'row_color' => $workOrder->row_color
  );

  // Make JSON
  print_r(json_encode($workOrder_arr));

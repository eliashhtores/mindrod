<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/WorkOrder.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate Work Orders object
  $workOrder = new WorkOrder($db);

  // Get year and month
  $workOrder->years = isset($_GET['years']) ? $_GET['years'] : die();
  $workOrder->month = isset($_GET['month']) ? $_GET['month'] : die();

  // Work Orders query
  $result = $workOrder->read();

  // Get row count
  $num = $result->rowCount();

  // Check if any work orders
  if($num > 0) {
    // Work Order array
    $workOrders_arr = array();

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $workOrder_item = array(
        'id' => $id,
        'invoice' => $invoice,
        'work_order_number' => $work_order_number,
        'folio' => $folio,
        'dwg_number' => $dwg_number,
        'description' => $description,
        'client' => $client,
        'machine' => $machine,
        'quantity' => $quantity,
        'serial' => $serial,
        'receipt_date' => $receipt_date,
        'commitment_date' => $commitment_date,
        'due_date' => $due_date,
        'rework' => $rework,
        'indicator' => $indicator,
        'machinist' => $machinist,
        'status' => $status,
        'observations' => $observations,
        'row_color' => $row_color
      );

      // Push to "data"
      array_push($workOrders_arr, $workOrder_item);
    }

    // Turn to JSON & output
    echo json_encode($workOrders_arr);

  } else {
    // No Work Orders 
    echo json_encode(
      array('message' => 'No Work orders found')
    );
  }

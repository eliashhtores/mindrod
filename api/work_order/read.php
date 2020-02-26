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

  // Get year, month and row colors
  // @@TODO make this and the one on load_totals.php on the WorkOrder Class
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

  // Work Orders query
  try {
    $result = $workOrder->read();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $workOrder->query;
    return;
  }

  // echo json_encode(array('result' => $workOrder));

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

<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/Serial.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate Work Orders object
  $latest_serial = new Serial($db);

  // Serial query
  $result = $latest_serial->read();

  // Get row count
  $num = $result->rowCount();

  // Check if serial
  if($num > 0) {
    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);
    }

    // Turn to JSON & output
    echo json_encode($serial);

  } else {
    // No serial
    echo json_encode(
      array('message' => 'No serial')
    );
  }

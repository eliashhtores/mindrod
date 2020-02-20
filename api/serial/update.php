<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../../config/Database.php';
  include_once '../../models/Serial.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $latest_serial = new Serial($db);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  // Set ID to update
  $latest_serial->quantity = $data->quantity;

  // Update Serial

  if($latest_serial->update()) {
    echo json_encode(
      array('message' => 'Serial updated',
            'result' => $latest_serial)
    );
  } else {
    echo json_encode(
      array('message' => 'Serial not updated')
    );
  }


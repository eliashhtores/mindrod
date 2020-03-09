<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../../config/Database.php';
  include_once '../../models/User.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate User object
  $user = new User($db);

  $user->username = isset($_GET['username']) ? $_GET['username'] : '';
  $user->password = isset($_GET['password']) ? $_GET['password'] : '';

  // Check if user exists
  try {
    $result = $user->validate_user();
  } catch (Exception $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo $e->getMessage() . ' while executing: ' . $user->query;
    return;
  } 

  // Create array
  $userArr = array(
    'count' => $result->rowCount(),
    'id' => $user->id,
    'role_id' => $user->role_id,
    'username' => $user->username,
    'name' => $user->name
  );

  // Make JSON
  print_r(json_encode($userArr));

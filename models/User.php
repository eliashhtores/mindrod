<?php 
  class User {
    // DB stuff
    private $conn;
    private $table = 'user';

    // User properties
    public $id;
    public $role_id;
    public $username;
    public $password;
    public $name;

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

    // Check if user exist
    public function validate_user() {
      // Create query
      $query = "SELECT id, role_id, username, name FROM $this->table
        WHERE username = ?
        AND password = PASSWORD('$this->password')";

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Execute query
      $stmt->execute([$this->username]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $this->id = $row['id'];
      $this->role_id = $row['role_id'];
      $this->username = $row['username'];
      $this->name = $row['name'];
      $this->password = $this->password;

      return $stmt;
    }
}

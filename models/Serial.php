<?php 
  class Serial {
    // DB stuff
    private $conn;
    private $table = 'serial';

    // Serial properties
    public $quantity;

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

    // Get latest serial 
    public function read() {
      // Create query
      $query = 'SELECT MAX(latest_serial) AS serial FROM '. $this->table;

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Execute query
      $stmt->execute();

      return $stmt;
    }

    // Update serial
    public function update() {
        $query = 'UPDATE ' . $this->table . '
        SET latest_serial = ? + latest_serial';

        $stmt = $this->conn->prepare($query);

        // Execute query
        if($stmt->execute($this->quantity)) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}

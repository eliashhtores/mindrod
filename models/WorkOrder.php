<?php 
  class WorkOrder {
    // DB stuff
    private $conn;
    private $table = 'work_order';

    // Work order properties
    public $id;
    public $invoice;
    public $work_order_number;
    public $folio;
    public $dwg_number;
    public $description;
    public $client;
    public $machine;
    public $quantity;
    public $serial;
    public $receipt_date;
    public $commitment_date;
    public $due_date;
    public $rework;
    public $indicator;
    public $machinist;
    public $status;
    public $observations;
    public $row_color;
    public $monthQuery;
    public $rowColorQuery;
    public $query;
    public $last_update;

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

    // Get work orders 
    public function read() {
      // Create query
      $this->query = "SELECT * FROM $this->table WHERE YEAR(receipt_date) = ?
      $this->monthQuery
      $this->rowColorQuery
      AND status >= 0";

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute([$this->year]);

      return $stmt;
    }

    // Get single work order
    public function read_single() {
      // Create query
      $this->query = 'SELECT * FROM ' . $this->table . ' WHERE id = ?';

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute([$this->id]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      // Set properties
      $this->id = $row['id'];
      $this->invoice = $row['invoice'];
      $this->work_order_number = $row['work_order_number'];
      $this->folio = $row['folio'];
      $this->dwg_number = $row['dwg_number'];
      $this->description = $row['description'];
      $this->client = $row['client'];
      $this->machine = $row['machine'];
      $this->quantity = $row['quantity'];
      $this->serial = $row['serial'];
      $this->receipt_date = $row['receipt_date'];
      $this->commitment_date = $row['commitment_date'];
      $this->due_date = $row['due_date'];
      $this->rework = $row['rework'];
      $this->indicator = $row['indicator'];
      $this->machinist = $row['machinist'];
      $this->status = $row['status'];
      $this->observations = $row['observations'];
      $this->row_color = $row['row_color'];
    }

    // Get totals
    public function load_totals() {
      // Create query
      $this->query = "SELECT 
        SUM(CASE WHEN indicator = 'AT' THEN 1 ELSE 0 END) AS early,
        SUM(CASE WHEN indicator = 'ET' THEN 1 ELSE 0 END) AS onTime,
        SUM(CASE WHEN indicator = 'FT' THEN 1 ELSE 0 END) AS outOfTime,
        SUM(CASE WHEN rework = 'R' THEN 1 ELSE 0 END) AS reworks,
        AVG(status) AS average,
        COUNT(*) AS total
        FROM $this->table
        WHERE YEAR(receipt_date) = ?
          $this->monthQuery
          $this->rowColorQuery
          AND status >= 0";

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute([$this->year]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      // Set properties
      $this->early = $row['early'];
      $this->onTime = $row['onTime'];
      $this->outOfTime = $row['outOfTime'];
      $this->reworks = $row['reworks'];    
      $this->average = number_format((float)$row['average'], 2, '.', '') . '%';
      $this->total = $row['total'];
    }

    // Get totals
    public function last_update() {
      // Create query
      $this->query = "SELECT MAX(updated_at) AS updated_at FROM $this->table";

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute();
      $row = $stmt->fetch();

      // Set properties
      $this->last_update = $row[0];
    }    

    // Deactivate single work order
    public function deactivate_work_order() {
      // Deactivate query
      $this->query = 'UPDATE work_order SET status = -1, updated_by = ?
        WHERE id = ?';

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      if($stmt->execute([$this->updated_by, $this->id])) {
        return true;
      }
      
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    // Clean data
    public function cleanData($param) {
      $param = htmlspecialchars(strip_tags($param));
      return $param;
    }

    // Update Work order
    public function update() {
      $params = array();

      // Clean data
      $this->invoice = $this->cleanData($this->invoice);
      $this->work_order_number = $this->cleanData($this->work_order_number);
      $this->dwg_number = $this->cleanData($this->dwg_number);
      $this->description = $this->cleanData($this->description);
      $this->client = $this->cleanData($this->client);
      $this->machine = $this->cleanData($this->machine);
      $this->quantity = $this->cleanData($this->quantity);
      $this->serial = $this->cleanData($this->serial);
      $this->rework = $this->cleanData($this->rework);
      $this->indicator = $this->cleanData($this->indicator);
      $this->machinist = $this->cleanData($this->machinist);
      $this->status = $this->cleanData($this->status);
      $this->observations = $this->cleanData($this->observations);
      $this->row_color = $this->cleanData($this->row_color);

      $userType = $this->getUserType($this->updated_by);

      if ($userType === 'administrator') {    
        $this->query = 'UPDATE ' . $this->table . '
        SET invoice = ?, work_order_number = ?, dwg_number = ?,
            description = ?, client = ?, machine = ?, quantity = ?,
            serial = ?, receipt_date = ?, commitment_date = ?,
            observations = ?, row_color = ?, updated_by = ?
        WHERE id = ?';
        
        $params = [$this->invoice, $this->work_order_number, $this->dwg_number, $this->description, $this->client, $this->machine, $this->quantity, 
        $this->serial, $this->receipt_date, $this->commitment_date, $this->observations, $this->row_color, $this->updated_by, $this->id];

      } else if ($userType === 'metrology') { 
        $this->query = 'UPDATE ' . $this->table . '
        SET rework = ?, observations = ?, row_color = ?, updated_by = ?
        WHERE id = ?';

        $params = [$this->rework, $this->observations, $this->row_color, $this->updated_by, $this->id];

      } else {
        $this->query = 'UPDATE ' . $this->table . '
        SET indicator = ?, machinist = ?, status = ?,
            due_date = ?, observations = ?, row_color = ?,
            updated_by = ?
        WHERE id = ?';

        $params = [$this->indicator, $this->machinist, $this->status, $this->due_date, $this->observations, $this->row_color, $this->updated_by, $this->id];
      }

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      if($stmt->execute($params)) {
          return true;
      }

      // Print error if something goes wrong
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    // Create work order
    public function create() {
      $params = array();
      // Create query
      $this->query = 'INSERT INTO ' . $this->table . ' SET invoice = ?, work_order_number = ?, folio = ?, dwg_number = ?,
      description = ?, client = ?, machine = ?, quantity = ?,
      serial = ?, receipt_date = ?, commitment_date = ?, observations = ?,
      created_by = ?';

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Clean data
      $this->invoice = $this->cleanData($this->invoice);
      $this->work_order_number = $this->cleanData($this->work_order_number);
      $this->dwg_number = $this->cleanData($this->dwg_number);
      $this->description = $this->cleanData($this->description);
      $this->client = $this->cleanData($this->client);
      $this->machine = $this->cleanData($this->machine);
      $this->quantity = $this->cleanData($this->quantity);
      $this->serial = $this->cleanData($this->serial);
      $this->receipt_date = $this->cleanData($this->receipt_date);
      $this->commitment_date = $this->cleanData($this->commitment_date);
      $this->observations = $this->cleanData($this->observations);
      $this->invoice = $this->cleanData($this->invoice);
      $folio = $this->getFolio();

      $params = [$this->invoice, $this->work_order_number, $folio, $this->dwg_number, $this->description, $this->client, $this->machine, 
      $this->quantity, $this->serial, $this->receipt_date, $this->commitment_date, $this->observations, $this->created_by];

      // Execute query
      if($stmt->execute($params)) {
        $this->updateSerial();
        $this->setFolio();
        return true;
      }

      // Print error if something goes wrong
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    private function getUserType() {
      $query = "SELECT description
      FROM role
      JOIN user ON (user.role_id = role.id)
      WHERE user.id = ?";

      $stmt = $this->conn->prepare($query);
      
      $stmt->execute([$this->updated_by]);
      $description = $stmt->fetch();

      return $description[0];
    }

    public function getFolio() {
      $query = "SELECT current_folio + 1 FROM folio";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      $folio = $stmt->fetch();
      return $folio[0];
    }

    public function setFolio() {
      $query = "UPDATE folio SET current_folio = current_folio + 1";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
    }

    // Update serial
    public function updateSerial() {
      $query = 'UPDATE serial
      SET latest_serial = ? + latest_serial';

      $stmt = $this->conn->prepare($query);
      // Execute query
      if($stmt->execute([$this->quantity])) {
          return true;
      }

      // Print error if something goes wrong
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

  }
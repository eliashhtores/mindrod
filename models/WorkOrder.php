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

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

    // Get work orders 
    public function read() {
      // Create query
      $this->query = "SELECT * FROM $this->table WHERE YEAR(receipt_date) = $this->year
      $this->monthQuery
      $this->rowColorQuery
      AND status >= 0";

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute([$this->years, $this->month]);

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
        WHERE YEAR(receipt_date) = $this->year
          $this->monthQuery
          $this->rowColorQuery
          AND status >= 0";

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      // Execute query
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      // Set properties
      $this->early = $row['early'];
      $this->onTime = $row['onTime'];
      $this->outOfTime = $row['outOfTime'];
      $this->reworks = $row['reworks'];    
      $this->average = number_format((float)$row['average'], 2, '.', '') . '%';
      $this->total = $row['total'];
    }

    // Deactivate single work order
    public function deactivate_work_order() {
      // Deactivate query
      $this->query = 'UPDATE work_order SET status = -1, updated_by = :updated_by
        WHERE id = :id';

      // Prepare statement
      $stmt = $this->conn->prepare($this->query);

      $stmt->bindParam(':updated_by', $this->updated_by);
      $stmt->bindParam(':id', $this->id);

      // Execute query
      if($stmt->execute()) {
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

      $userType = $this->getUserType();

      if ($userType === 'administrator') {    
        $query = 'UPDATE ' . $this->table . '
        SET invoice = :invoice, work_order_number = :work_order_number, dwg_number = :dwg_number,
            description = :description, client = :client, machine = :machine, quantity = :quantity,
            serial = :serial, receipt_date = :receipt_date, commitment_date = :commitment_date,
            observations = :observations, row_color = :row_color, updated_by = :updated_by
        WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':invoice', $this->invoice);
        $stmt->bindParam(':work_order_number', $this->work_order_number);
        $stmt->bindParam(':dwg_number', $this->dwg_number);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':client', $this->client);
        $stmt->bindParam(':machine', $this->machine);
        $stmt->bindParam(':quantity', $this->quantity);
        $stmt->bindParam(':serial', $this->serial);
        $stmt->bindParam(':receipt_date', $this->receipt_date);
        $stmt->bindParam(':commitment_date', $this->commitment_date);
        $stmt->bindParam(':observations', $this->observations);
        $stmt->bindParam(':row_color', $this->row_color);
        $stmt->bindParam(':updated_by', $this->updated_by);
        $stmt->bindParam(':id', $this->id);

      } else if ($userType === 'metrology') { 
        $query = 'UPDATE ' . $this->table . '
        SET rework = :rework, observations = :observations, row_color = :row_color, updated_by = :updated_by
        WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':rework', $this->rework);
        $stmt->bindParam(':observations', $this->observations);
        $stmt->bindParam(':row_color', $this->row_color);
        $stmt->bindParam(':updated_by', $this->updated_by);
        $stmt->bindParam(':id', $this->id);

      } else {
        $query = 'UPDATE ' . $this->table . '
        SET indicator = :indicator, machinist = :machinist, status = :status,
            due_date = :due_date, observations = :observations, row_color = :row_color,
            updated_by = :updated_by
        WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':indicator', $this->indicator);
        $stmt->bindParam(':machinist', $this->machinist);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':due_date', $this->due_date);
        $stmt->bindParam(':observations', $this->observations);
        $stmt->bindParam(':row_color', $this->row_color);
        $stmt->bindParam(':updated_by', $this->updated_by);
        $stmt->bindParam(':id', $this->id);
      }

      // Execute query
      if($stmt->execute()) {
          return true;
      }

      // Print error if something goes wrong
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

    // Create work order
    public function create() {
      // Create query
      $this->query = 'INSERT INTO ' . $this->table . ' SET invoice = :invoice, work_order_number = :work_order_number, folio = :folio, dwg_number = :dwg_number,
      description = :description, client = :client, machine = :machine, quantity = :quantity,
      serial = :serial, receipt_date = :receipt_date, commitment_date = :commitment_date, observations = :observations,
      created_by = :created_by';

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
      $this->created_by = $this->cleanData($this->created_by);
      $this->invoice = $this->cleanData($this->invoice);
      $folio = $this->getFolio();

      // Bind data
      $stmt->bindParam(':invoice', $this->invoice);
      $stmt->bindParam(':work_order_number', $this->work_order_number);
      $stmt->bindParam(':folio', $folio);
      $stmt->bindParam(':dwg_number', $this->dwg_number);
      $stmt->bindParam(':description', $this->description);
      $stmt->bindParam(':client', $this->client);
      $stmt->bindParam(':machine', $this->machine);
      $stmt->bindParam(':quantity', $this->quantity);
      $stmt->bindParam(':serial', $this->serial);
      $stmt->bindParam(':receipt_date', $this->receipt_date);
      $stmt->bindParam(':commitment_date', $this->commitment_date);
      $stmt->bindParam(':observations', $this->observations);
      $stmt->bindParam(':created_by', $this->created_by);

      // Execute query
      if($stmt->execute()) {
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
      WHERE user.id = '$this->updated_by'";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
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
      SET latest_serial = :quantity + latest_serial';

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':quantity', $this->quantity);
      // Execute query
      if($stmt->execute()) {
          return true;
      }

      // Print error if something goes wrong
      printf("Error: %s.\n", $stmt->error);
      return false;
    }

  }
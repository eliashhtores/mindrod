<?php
require_once('include/connect.php');
require_once('include/auth.php');

$year = $_GET['years'];

if (isset($_GET['month'])) {
  $month = $_GET['month'];  
  foreach($month as &$value){
     $value = "'$value'";
  }
  $month = implode(",", $month);
  $monthQuery = "AND MONTH(receipt_date) IN ($month)";
} else {
  $monthQuery = '';
}

if (isset($_GET['row_color'])) {
  $rowColor = $_GET['row_color'];  
  foreach($rowColor as &$value){
     $value = "'$value'";
  }
  $rowColor = implode(",", $rowColor);
  $rowColorQuery = "AND row_color IN ($rowColor)";
} else {
  $rowColorQuery = '';
}

$user_id = $_SESSION['id'];
$link = "#";

$sth = $dbh->query("SELECT * FROM work_order WHERE YEAR(receipt_date) = $year $monthQuery $rowColorQuery AND status >= 0");
$results = $sth->fetchAll(PDO::FETCH_ASSOC);

$headers = array('', '', '', 'No.Fact.', 'No.Oc', 'Folio', 'Dwg', 'Descripción', 'Cliente', 'Maquina', 'Cantd', 'Serie', 'Recibido', 'Compromiso', 'Entrega', 'Retrabajos', 'Indic.', 'Realizó Mecánico', 'Status', 'Observaciones', 'Status OC');
$months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
$colors = array('row-pink' => 'Entregado al cliente', 'row-blue' => 'En almacén', 'row-red' => 'Cuarentena');

$sth = $dbh->query("SELECT attributes FROM role
JOIN user ON (role.id = user.role_id)
WHERE user.id = $user_id");
$results_attr = $sth->fetch();

$sth = $dbh->query('SELECT DISTINCT(YEAR(STR_TO_DATE(receipt_date, "%Y-%m-%d"))) AS year FROM work_order WHERE status >= 0');
$results_years = $sth->fetchAll();

$attributes = array('invoice', 'work_order_number', 'folio', 'dwg_number', 'description', 'client', 'machine', 'quantity', 'serial', 'receipt_date', 'commitment_date', 'due_date', 'rework', 'indicator', 'machinist', 'status', 'observations', 'row_color');
$user_attrs = explode(", ", $results_attr['attributes']);

$sth = $dbh->query("SELECT COUNT(*) AS total
FROM work_order
WHERE YEAR(receipt_date) = $year
  $monthQuery
  $rowColorQuery
  AND status >= 0");
$result = $sth->fetch(PDO::FETCH_ASSOC);

$sth = $dbh->query("SELECT 
SUM(CASE WHEN indicator = 'AT' THEN 1 ELSE 0 END) AS early,
SUM(CASE WHEN indicator = 'ET' THEN 1 ELSE 0 END) AS on_time,
SUM(CASE WHEN indicator = 'FT' THEN 1 ELSE 0 END) AS out_of_time,
SUM(CASE WHEN rework = 'R' THEN 1 ELSE 0 END) AS reworks,
AVG(status) AS average
FROM work_order
WHERE YEAR(receipt_date) = $year
$monthQuery
$rowColorQuery
AND status >= 0");
$data = $sth->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Ordenes de trabajo</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

  <!-- Page level plugin CSS-->
  <link href="vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">

  <link href="css/toastr.min.css" rel="stylesheet"/>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Page level plugin JavaScript-->
  <script src="vendor/datatables/jquery.dataTables.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.js"></script>

  <script src="js/toastr.min.js"></script>

</head>

<body id="page-top" class="sidebar-toggled">

  <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
    <div class="container">
      <?php
        if ($_SESSION['role_id'] == 1) {
          $link = "dashboard.php";
        }
        echo "<a class='navbar-brand mr-1' href='$link'>MINDROD</a>";
      ?>

      <!-- Navbar -->
      <ul class="navbar-nav ml-auto ml-md-0">
        <li class="nav-item">
          <a class="nav-link" href="<?php echo $link; ?>">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Administración</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="charts.php">
            <i class="fas fa-fw fa-chart-area"></i>
            <span>Gráficas</span></a>
        </li>
        <li class="nav-item active">
          <a class="nav-link" href="create_table2.php">
            <i class="fas fa-fw fa-table"></i>
            <span>Ordenes de trabajo</span></a>
        </li>
        <li class="nav-item dropdown no-arrow">
          <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-user-circle fa-fw"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
            <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Salir</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>

  <div id="wrapper">

    <div id="content-wrapper">

      <div class="container-fluid">

        <!-- Breadcrumbs-->
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="#">Administración</a>
          </li>
          <li class="breadcrumb-item active">Ordenes de trabajo</li>
        </ol>

        <div class="row text-center">

          <div class="col">
          <table class="table table-bordered">
            <tbody>
              <tr>
                  <td>Cumplimiento mes</td>
                  <td><?php echo number_format((float)$data['average'], 2, '.', ''); ?>%</td>
              </tr>
                <tr>
                  <td>Número de ordenes</td>
                  <td><?php echo $result['total']; ?></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="container w-25">
            <form action="table2.php" method="get">
              <div class="row">
                <select class="form-control" id="years" name="years">
                  <?php
                  foreach ($results_years as $results_year) {
                    $selected = '';
                    $results_year['year'] == $year ? $selected = "selected='selected'" : '';
                    echo "<option $selected value='{$results_year['year']}'>{$results_year['year']}</option>";
                  }
                  ?>
                </select>
              </div>

              <div class="row mt-2">
                <select class="form-control" multiple id="month" name="month[]" size="9">
                <?php
                foreach ($months as $key => $value) {
                  $key++;
                  $selected = '';
                  if (in_array($key, $_GET['month'])) {
                    $selected = "selected='selected'";
                  }
                  echo "<option value='$key' $selected>$value</option>";
                }
                ?>
                </select>
                <small class="form-text text-muted">Control + click para seleccionar o deseleccionar</small>
              </div>

              <div class="row mt-2">
                <label class='small' for='row_color'>Status</label>
                <select class='form-control form-control-sm' multiple id='row_color' name="row_color[]" size="9">
                <?php
                
                foreach ($colors as $key => $value) {
                  $selected = '';
                  if (isset($_GET['row_color'])) {                  
                    if (in_array($key, $_GET['row_color'])) {
                      $selected = "selected='selected'";
                    }
                  }
                  echo "<option value='$key' $selected>$value</option>";
                }
                ?>
                </select>
              </div>

              <div class="row mt-2 mb-2">
                <input type="submit" value="Ver" class="btn btn-dark btn-block" id="triggerTable">
              </div>
            </form>
          </div>
        
          <div class="col text-mutted">
          <table class="table table-bordered">
            <thead>
              <tr>
                  <th>Cantidad</th>
                  <th></th>
                  <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td><?php echo $data['early']; ?></td>
                  <td>Antes de tiempo (AT)</td>
                  <?php
                  $data['early'] == 0 ? $early = 0 : $early = number_format((float)$data['early']/$result['total'] * 100, 2, '.', '');
                  ?>
                  <td class="alert alert-success"><?php echo $early;?></td>
              </tr>
                <tr>
                  <td><?php echo $data['on_time']; ?></td>
                  <td>En tiempo (ET)</td>
                  <?php
                  $data['on_time'] == 0 ? $on_time = 0 : $on_time = number_format((float)$data['on_time']/$result['total'] * 100, 2, '.', '');
                  ?>                  
                  <td class="alert alert-warning"><?php echo $on_time; ?></td>
                </tr>
                <tr>
                  <td><?php echo $data['out_of_time']; ?></td>
                  <td>Fuera de tiempo (FT)</td>
                  <?php
                  $data['out_of_time'] == 0 ? $out_of_time = 0 : $out_of_time = number_format((float)$data['out_of_time']/$result['total'] * 100, 2, '.', '');
                  ?>                  
                  <td class="alert alert-danger"><?php echo $out_of_time; ?></td>
                </tr>
                <tr>
                  <td><?php echo $data['reworks']; ?></td>
                  <td>Retrabajo (R)</td>
                  <?php
                  $data['reworks'] == 0 ? $reworks = 0 : $reworks = number_format((float)$data['reworks']/$result['total'] * 100, 2, '.', '');
                  ?>                  
                  <td class="alert alert-primary"><?php echo $reworks; ?></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div class="card mb-3" id="work-orders">
          <div class="card-header">
            <i class="fas fa-table"></i>
            Ordenes de trabajo</div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                <thead>
                  <tr id="headers">
                </thead>
                <tbody id="table">
                <?php
                  foreach ($results as $result) {
                    echo "<tr class='item {$result['row_color']}'>";
                    echo "<td><button id='{$result['id']}' class='btn btn-link edit_data'><i class='fa fa-pencil-square-o'></i></button></td>";
                    echo "<td><a href='/mindrod/uploads/{$result['id']}.pdf' target='_blank' class='btn btn-link'><i class='fas fa-file-pdf'></i></a></td>";
                    echo "<td><button id='{$result['id']}' class='btn btn-alert btn-link remove-data'><i class='fa fa-remove'></i></button></td>";
                    foreach ($attributes as $key => $value) {
                      if ($value == 'description') {
                        echo "<td>
                        <div align='center'><button class='btn btn-primary' data-toggle='collapse' id='details' data-target='#collapse-btn-description-{$result['id']}'>Ver</button></div>
                        <div class='collapse mt-2' id='collapse-btn-description-{$result['id']}'>
                          {$result[$attributes[$key]]}
                        </div>
                        </td>";
                      } else if ($value == 'observations') {
                        echo "<td>
                        <div align='center'><button class='btn btn-primary' data-toggle='collapse' id='details' data-target='#collapse-btn-observations-{$result['id']}'>Ver</button></div>
                        <div class='collapse mt-2' id='collapse-btn-observations-{$result['id']}'>
                          {$result[$attributes[$key]]}
                        </div>
                        </td>";
                      } else if ($value == 'row_color') {
                        continue;
                      } else {
                        echo "<td><div align='center'>{$result[$attributes[$key]]}</div></td>";
                      }
                    }
                    echo "</tr>";
                  }
                  ?>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer small text-muted">Última actualización <?php echo date("Y-m-d H:i:s"); ?></div>
        </div>
        </div>
      </div>
      <!-- /.container-fluid -->

      <!-- UPDATE MODAL  -->
      <div class="modal fade" id="updateModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modificar orden de trabajo</h5>
              <button class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <form method="GET" id="insert_form">
              <?php
              $disabled = '';
              foreach ($attributes as $key => $value) {
                if (in_array($value, $user_attrs)) {
                  $label = $key + 3;
                  echo '<div class="form-group">';
                  if ($value === 'description' || $value === 'observations') {
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<textarea rows='2' cols='45' class='form-control form-control-sm' id='$value' name='$value'></textarea>";
                  } else if ($value === 'status' || $value === 'quantity') {
                    if ($value === 'quantity') 
                      $disabled = 'disabled';
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<input type='number' class='form-control form-control-sm w-25' min=0 id='$value' name='$value' $disabled>";
                  } else if ($value === 'receipt_date' || $value === 'commitment_date' || $value === 'due_date') {
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<input type='date' class='form-control form-control-sm' id='$value' name='$value'>";
                  } else if ($value === 'rework') {
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<select class='form-control form-control-sm' id='rework' name='rework'>";
                    echo "<option></option>";
                    echo '<option value="R">Sí</option>';
                    echo "</select>";
                  } else if ($value === 'row_color') {
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<select class='form-control form-control-sm' id='row_color_single' name='row_color_single'>";
                    echo "<option></option>";
                    echo '<option value="row-pink">Entregado al cliente</option>';
                    echo '<option value="row-blue">En almacén</option>';
                    echo '<option value="row-red">Cuarentena</option>';
                    echo "</select>";
                  } else if ($value === 'folio') {
                    continue;
                  } else {
                    echo "<label class='small' for='$value'>$headers[$label]</label>";
                    echo "<input type='text' class='form-control form-control-sm' id='$value' name='$value' $disabled>";

                  }
                  echo "</div>";
                }
              }
              echo '<div class="form-group">';
              echo '<label class="small" for="pdf">Archivo PDF</label>';
              echo '<input type="file" id="pdf" name="pdf" formenctype="multipart/form-data" class="form-control-file">';
              echo '</div>';
              ?>
                <input type="hidden" name="id" id="id" />
                <input type="hidden" name="updated_by" id="updated_by" value="<?php echo $user_id; ?>" />
              </div>
              <div class="modal-footer">
                <input type="submit" name="insert" id="insert" value="Modificar" class="btn btn-primary" />
              </div>
              </form>
            </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer -->
    <!-- <footer class="sticky-footer">
      <div class="container my-auto">
        <div class="copyright text-center my-auto">
          Copyright © Mindrod <span id="currentYear"></span>
        </div>
      </div>
    </footer> -->
    <!-- /.content-wrapper -->

  </div>
  <!-- /#wrapper -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>

  <!-- Logout Modal-->
  <div class="modal fade" id="logoutModal" tabdashboard="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">¿Desea salir?</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">Seleccione "Salir" si está listo para terminar su sesión</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>
          <a class="btn btn-primary" href="index.php">Salir</a>
        </div>
      </div>
    </div>
  </div>

  <script language="JavaScript" type="text/javascript" src="js/tables2.js"></script>
  <script src="js/app.js"></script>
  <script src="js/easyhttp3.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin.min.js"></script>

  <!-- Demo scripts for this page-->
  <script src="js/demo/datatables-demo.js"></script>

</body>

</html>
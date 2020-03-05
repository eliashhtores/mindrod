<?php
require_once('include/connect.php');
require_once('include/auth.php');
ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();

//$year = $_POST['years'];
// $month = (int)$_POST['month'];
$year = date('Y');
$link = "#";
$months = array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

foreach ($months as $key=> $month) {
  $key++;
  $sth = $dbh->query("SELECT COUNT(*) AS total_work_orders
  FROM work_order
  WHERE YEAR(receipt_date) = $year
    AND MONTH(receipt_date) = $key
    AND status >= 0");
  $result[$key] = $sth->fetch(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Gráficas</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

  <!-- Page level plugin CSS-->
  <link href="vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">

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
        <li class="nav-item active">
          <a class="nav-link" href="charts.php">
            <i class="fas fa-fw fa-chart-area"></i>
            <span>Gráficas</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="table.php">
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
          <li class="breadcrumb-item active">Gráficas</li>
        </ol>

        <div class="row">
          <div class="col-lg-8">
            <div class="card mb-3">
              <div class="card-header">
                Objetivo 1. No rebasar el 10% de Re-trabajos mensual.
                <br> 
                (Produccion) <?php echo $year ?>
                </div>
              <div class="card-body">
                <canvas id="reworks" width="100%" height="50"></canvas>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="card mb-3">
              <div class="card-header">
              <br>
              <br>
              </div>
              <div class="card-body">
              <table class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th class="alert alert-primary">Retrabajos</th>
                    <th class="alert alert-primary">Menor o igual a 10%</th>
                    <th class="alert alert-danger">Entregas F. Tiempo</th>
                    <th class="alert alert-danger">Menor o igual a 5%</th>
                  </tr>
                </thead>
                <tbody>
                  <?php
                  foreach ($months as $key=> $month) {
                    $key++;
                    $reworks = '';
                    $out_of_time = '';
                    $sth = $dbh->query("SELECT MONTH(receipt_date) AS month, 
                      SUM(CASE WHEN indicator = 'AT' THEN 1 ELSE 0 END) AS early,
                      SUM(CASE WHEN indicator = 'ET' THEN 1 ELSE 0 END) AS on_time,
                      SUM(CASE WHEN indicator = 'FT' THEN 1 ELSE 0 END) AS out_of_time,
                      SUM(CASE WHEN rework = 'R' THEN 1 ELSE 0 END) AS reworks
                    FROM work_order
                    WHERE YEAR(receipt_date) = $year
                      AND MONTH(receipt_date) = $key
                      AND status >= 0
                    GROUP BY 1");
                    $data = $sth->fetch(PDO::FETCH_ASSOC);
                    if ($result[$key]['total_work_orders'] != 0) {
                      $reworks = $data['reworks'] / $result[$key]['total_work_orders'];
                      $reworks = number_format((float)$reworks * 100, 2, '.', '') . "%";
                       
                      $out_of_time = $data['out_of_time'] / $result[$key]['total_work_orders'];
                      $out_of_time = number_format((float)$out_of_time * 100, 2, '.', '') . "%";  
                    }
                    echo "<tr>";
                    echo "<th scope='row'>$month</th>";
                    echo "<td>$reworks</td>";
                    echo "<td>10%</td>";
                    echo "<td>$out_of_time</td>";
                    echo "<td>5%</td>";
                    echo "</tr>";
                  }
                  ?>
                </tbody>
              </table>
            </div>
          </div>
        </div>

          <div class="col-lg-8">
            <div class="card mb-3">
              <div class="card-header">
                Objetivo 1. No rebasar el 5% de entregas fuera de tiempo.
                <br> 
                (Produccion) <?php echo $year ?>
                </div>
              <div class="card-body">
                <canvas id="out_of_time" width="100%" height="50"></canvas>
              </div>
          </div>
      </div>

      <div class="col-lg-8">
            <div class="card mb-3">
              <div class="card-header">
                Entregas en tiempo
                </div>
              <div class="card-body">
                <canvas id="on_time" width="100%" height="50"></canvas>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="card mb-3">
              <div class="card-header">
              Entregas en tiempo
              <br>
              </div>
              <div class="card-body">
              <table class="table table-bordered table-striped">
                <tbody>
                  <?php
                  foreach ($months as $key=> $month) {
                    $key++;
                    $on_time = '';
                    $sth = $dbh->query("SELECT MONTH(receipt_date) AS month, 
                      SUM(CASE WHEN indicator = 'AT' THEN 1 ELSE 0 END) AS early,
                      SUM(CASE WHEN indicator = 'ET' THEN 1 ELSE 0 END) AS on_time,
                      SUM(CASE WHEN indicator = 'FT' THEN 1 ELSE 0 END) AS out_of_time,
                      SUM(CASE WHEN rework = 'R' THEN 1 ELSE 0 END) AS reworks
                    FROM work_order
                    WHERE YEAR(receipt_date) = $year
                      AND MONTH(receipt_date) = $key
                      AND status >= 0
                    GROUP BY 1");
                    $data = $sth->fetch(PDO::FETCH_ASSOC);
                    if ($result[$key]['total_work_orders'] != 0) {
                      $on_time = $data['on_time'] / $result[$key]['total_work_orders'];
                      $on_time = number_format((float)$on_time * 100, 2, '.', '') . "%";
                    }
                    echo "<tr>";
                    echo "<th scope='row'>$month</th>";
                    echo "<td>$on_time</td>";
                    echo "</tr>";
                  }
                  ?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      
      <!-- /.container-fluid -->

      <!-- Sticky Footer -->
      <footer class="sticky-footer">
        <div class="container my-auto">
          <div class="copyright text-center my-auto">
            Copyright © Mindrod <span id="currentYear"></span>
          </div>
        </div>
      </footer>

    </div>
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

  <script src="js/app.js"></script>
  <script src="js/easyhttp3.js"></script>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Page level plugin JavaScript-->
  <script src="vendor/chart.js/Chart.min.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin.min.js"></script>

  <!-- Demo scripts for this page-->
  <script src="js/demo/chart-area-demo.js"></script>
  <script src="js/demo/chart-bar-demo.js"></script>
  <script src="js/demo/chart-pie-demo.js"></script>

</body>

</html>

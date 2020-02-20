
<?php
require_once('include/connect.php');
require_once('include/auth.php');
ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();

$sth = $dbh->query('SELECT DISTINCT(YEAR(STR_TO_DATE(receipt_date, "%Y-%m-%d"))) AS year FROM work_order WHERE status >= 0 ORDER BY year DESC');
$results_years = $sth->fetchAll();
$link = "#";

$sth = $dbh->query("SELECT DISTINCT row_color AS colors FROM work_order WHERE row_color IS NOT NULL");
$colors = $sth->fetchAll(PDO::FETCH_ASSOC);

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

        <div class="container w-25">
          <form action="table2.php" method="get">
            <div class="row">
              <select class="form-control" id="years" name="years">
                <?php
                foreach ($results_years as $results_year) {
                  echo "<option value='{$results_year['year']}'>{$results_year['year']}</option>";
                }
                ?>
              </select>
            </div>
            <div class="row mt-2">
              <select class="form-control" multiple id="month" name="month[]" size="9">
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <small class="form-text text-muted">Control + click para seleccionar o deseleccionar</small>
            </div>
            <div class="row mt-2">
              <label class='small' for='row_color'>Status</label>
              <select class='form-control form-control-sm' multiple id='row_color' name="row_color[]" size="9">
                <option value="row-pink">Entregado al cliente</option>
                <option value="row-blue">En almacén</option>
                <option value="row-red">Cuarentena</option>
              </select>
            </div>
            <div class="row mt-2 mb-2">
              <input type="submit" value="Ver" class="btn btn-dark btn-block" id="triggerTable">
            </div>
          </form>
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

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Page level plugin JavaScript-->
  <script src="vendor/datatables/jquery.dataTables.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin.min.js"></script>

  <!-- Demo scripts for this page-->
  <script src="js/demo/datatables-demo.js"></script>

</body>

</html>
<?php
ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Administración</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

  <!-- Page level plugin CSS-->
  <link href="vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Page level plugin JavaScript-->
  <script src="vendor/chart.js/Chart.min.js"></script>
  <script src="vendor/datatables/jquery.dataTables.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.js"></script>

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
        <li class="nav-item active">
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
          <li class="breadcrumb-item active">General</li>
        </ol>

        <!-- Icon Cards-->
        <div class="row">
          <div class="col-xl-3 col-sm-6 mb-3">
            <div class="card text-white bg-success o-hidden h-100">
              <div class="card-body">
                <div class="card-body-icon">
                  <i class="fas fa-fw fa-list"></i>
                </div>
                <div class="mr-5">Ordenes de trabajo este mes: <span id="current"></span></div>
              </div>
              <a class="card-footer text-white clearfix small z-1" href="#" id="new-task">
                <span class="float-left">Agregar nueva</span>
                <span class="float-right">
                  <i class="fas fa-angle-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <br>
        <!-- Area Chart Example-->
        <div class="container">
          <div class="row">
            <div class="col-md-9 mx-auto" id="container">
              <div class="card mb-3" id="task-form">
                <div class="card-header">
                  <i class="fas fa-fw fa-table"></i>
                  Agregar nueva orden de trabajo</div>
                  <div class="card-body">
                      <form method="POST" id="work-form">
                        <div class="form-group">
                          <label for="invoice">No.Fact.</label>
                          <input type="text" class="form-control" id="invoice" name="invoice">
                        </div>
                        <div class="form-group">
                          <label for="work_order_number">No.Oc</label>
                          <input type="text" class="form-control" id="work_order_number" name="work_order_number">
                        </div>
                        <div class="form-group">
                          <label for="dwg_number">DWG</label>
                          <input type="text" class="form-control" id="dwg_number" required="required" name="dwg_number">
                        </div>
                        <div class="form-group">
                          <label for="description">Descripción de trabajo</label>
                          <textarea rows="2" cols="45" class="form-control" name="description" id="description" required="required"></textarea>
                        </div>
                        <div class="form-group">
                          <label for="client">Cliente</label>
                          <input type="text" class="form-control" id="client" required="required" name="client">
                        </div>
                        <div class="form-group">
                          <label for="machine">Máquina</label>
                          <input type="text" class="form-control" id="machine" required="required" name="machine">
                        </div>
                        <div class="form-group">
                          <label for="quantity">Cantidad</label>
                          <input type="number" class="form-control w-25" id="quantity" min="1" required="required" name="quantity">
                        </div>
                        <div class="form-group">
                          <label for="serial">Serie</label>
                          <input type="text" class="form-control" id="serial" name="serial" disabled>
                        </div>
                        <div class="form-group">
                          <label for="receipt_date">Recibido</label>
                          <input type="date" class="form-control w-25" id="receipt_date" name="receipt_date" required="required">
                        </div>
                        <div class="form-group">
                          <label for="commitment_date">Compromiso</label>
                          <input type="date" class="form-control w-25" id="commitment_date" name="commitment_date" required="required">
                        </div>
                        <div class="form-group">
                          <label for="observations">Observaciones</label>
                          <textarea rows="2" cols="45" id="observations" class="form-control" name="observations"></textarea>
                        </div>
                        <input type="submit" value="Guardar" class="btn btn-dark btn-block" id="button">
                  </div>
                </div>
              </div>
            </div>
          </div>

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
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
  <script src="js/dashboard.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin.min.js"></script>

</body>

</html>

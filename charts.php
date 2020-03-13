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
        <div class="container col-4 ml-0"><img src="img/logo.jpg"></div>
        <div class="container col-6">
            <a class='navbar-brand mr-1 font-weight-bold' href='#'>Programa de fabricación</a>
            <!-- Navbar -->
            <ul class="navbar-nav ml-auto ml-md-0">
                <li class="nav-item">
                <a class="nav-link" id="dashboard">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Administración</span>
                </a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="charts.php">
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
                    <small><span id="user"></span></small>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Salir</a>
                </div>
                </li>
            </ul>
        </div>
        <div class="text-right text-danger col-2 font-weight-bold">FO-8.5.1 Rev. 2 01/01/2020</div>
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

                <div class="container w-25">
                    <form>
                    <div class="row">
                        <select class="form-control" id="years" name="years">
                        </select>
                    </div>
                    <div class="row mt-2 mb-2">
                        <input type="submit" value="Ver" class="btn btn-dark btn-block" id="triggerTable">
                    </div>
                    </form>
                </div>

                <div id="content" class="d-none">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="card mb-3">
                                <div class="card-header">
                                    Objetivo 1. No rebasar el 10% de Re-trabajos mensual.
                                    <br> 
                                    (Producción) <span class="year"></span>
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
                                    <tbody id="exceptions">                
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
                                (Producción) <span class="year"></span>                
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
                                    <tbody id="onTime">      
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                        <a class="btn btn-primary" href="index.php" id="exit">Salir</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <script src="js/charts.js"></script>
    <script src="js/app.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Page level plugin JavaScript-->
    <script src="vendor/chart.js/Chart.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin.min.js"></script>
    <script src="js/chart-bar.js"></script>

</body>

</html>
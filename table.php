<?php
require_once('include/connect.php');
require_once('include/auth.php');
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

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

  <!-- Page level plugin CSS-->
  <link href="vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">

  <link href="css/toastr.min.css" rel="stylesheet"/>

  <!-- Page level plugin JavaScript-->
  <script src="vendor/datatables/jquery.dataTables.js"></script>
  <script src="vendor/datatables/dataTables.bootstrap4.js"></script>

  <script src="js/toastr.min.js"></script>

</head>

<body id="page-top" class="sidebar-toggled">

  <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
    <div class="container">

    <!-- Get the role id to find out if the link will be displayed -->
      <a class='navbar-brand mr-1' href='dashboard.php'>MINDROD</a>
      <!-- Navbar -->
      <ul class="navbar-nav ml-auto ml-md-0">
        <li class="nav-item">
          <!-- Get the role id to find out if the link will be displayed -->
          <a class="nav-link" href="dashboard.php">
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
          <li class="breadcrumb-item active">Ordenes de trabajo</li>
        </ol>

        <div class="row text-center">

          <div class="col">
          <table class="table table-striped table-bordered nowrap dataTable no-footer">
            <tbody>
              <tr>
                  <td>Cumplimiento mes</td>
                  <td id="average"></td>
              </tr>
                <tr>
                  <td>Número de ordenes</td>
                  <td id="total"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="container w-25">
            <form>
              <div class="row">
                <select class="form-control" id="years" name="years">
                  <option  value='2019'>2019</option><option selected='selected' value='2020'>2020</option>
                </select>
              </div>

              <div class="row mt-2">
                <select class="form-control" multiple id="month" name="month[]" size="9">
                  <option value='1' >Enero</option>
                  <option value='2' >Febrero</option>
                  <option value='3' >Marzo</option>
                  <option value='4' >Abril</option>
                  <option value='5' >Mayo</option>
                  <option value='6' >Junio</option>
                  <option value='7' >Julio</option>
                  <option value='8' >Agosto</option>
                  <option value='9' >Septiembre</option>
                  <option value='10' >Octubre</option>
                  <option value='11' >Noviembre</option>
                  <option value='12' >Diciembre</option>
                </select>
                <small class="form-text text-muted">Control + click para seleccionar o deseleccionar</small>
              </div>

              <div class="row mt-2">
                
                <label class='small' for='row_color'>Status</label>
                <select class='form-control form-control-sm' multiple id='row_color' name="row_color[]" size="9">
                <option value='row-pink' >Entregado al cliente</option><option value='row-blue' >En almacén</option><option value='row-red' >Cuarentena</option>                </select>
              </div>

              <div class="row mt-2 mb-2">
                <input type="submit" value="Ver" class="btn btn-dark btn-block" id="triggerTable">
              </div>
            </form>
          </div>
        
          <div class="col text-mutted">
          <table class="table table-striped table-bordered nowrap dataTable no-footer">
            <thead>
              <tr>
                  <th>Cantidad</th>
                  <th></th>
                  <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="early"></td>
                <td>Antes de tiempo (AT)</td>
                <td class="alert alert-success" id ="earlyPercent"></td>
              </tr>
                <tr>
                  <td id="onTime"></td>
                  <td>En tiempo (ET)</td>            
                  <td class="alert alert-warning" id="onTimePercent"></td>
                </tr>
                <tr>
                  <td id="outOfTime"></td>
                  <td>Fuera de tiempo (FT)</td>   
                  <td class="alert alert-danger" id="outOfTimePercent"></td>
                </tr>
                <tr>
                  <td id="reworks"></td>
                  <td>Retrabajo (R)</td>            
                  <td class="alert alert-primary" id="reworksPercent"></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div class="card mb-3" id="work-orders" style="display: none;">

          <div class="card-header">
            <i class="fas fa-table"></i> Ordenes de trabajo
          </div>

          <div class="card-body">
            <div class="table-responsive">

              <table class="table table-bordered nowrap dataTable no-footer text-center" id="workOrderTable" width="100%" cellspacing="0">
                <thead>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>No.Fact.</th>
                  <th>No.Oc</th>
                  <th>Folio</th>
                  <th>Dwg</th>
                  <th>Descripción</th>
                  <th>Cliente</th>
                  <th>Maquina</th>
                  <th>Cantd</th>
                  <th>Serie</th>
                  <th>Recibido</th>
                  <th>Compromiso</th>
                  <th>Entrega</th>
                  <th>Retrabajos</th>
                  <th>Indic.</th>
                  <th>Realizó Mecánico</th>
                  <th>Status</th>
                  <th>Observaciones</th>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- @TODO Fix lastUpdate to be dynamic -->
          <div class="card-footer small text-muted" id="lastUpdate">Última actualización 2020-02-20 11:34:45</div>
        </div>
        </div>
      </div>
      <!-- /.container-fluid -->

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

    <!-- @TODO Fix modal to present inputs based on the user type -->
    <!-- Update Modal  -->
    <div class="modal fade" id="updateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modificar orden de trabajo</h5>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <form method="GET" id="insert_form">
              <div class="form-group">
                <label class='small' for='invoice'>No.Fact.</label>
                <input type='text' class='form-control form-control-sm' id='invoice' name='invoice'>
              </div>
              <div class="form-group">
                <label class='small' for='work_order_number'>No.Oc</label>
                <input type='text' class='form-control form-control-sm' id='work_order_number' name='work_order_number'>
              </div>
              <div class="form-group">
                <label class='small' for='dwg_number'>Dwg</label>
                <input type='text' class='form-control form-control-sm' id='dwg_number' name='dwg_number'>
              </div>
              <div class="form-group">
                <label class='small' for='description'>Descripción</label>
                <textarea rows='2' cols='45' class='form-control form-control-sm' id='description' name='description'></textarea>
              </div>
              <div class="form-group">
                <label class='small' for='client'>Cliente</label>
                <input type='text' class='form-control form-control-sm' id='client' name='client'>
              </div>
              <div class="form-group">
                <label class='small' for='machine'>Maquina</label>
                <input type='text' class='form-control form-control-sm' id='machine' name='machine'>
              </div>
              <div class="form-group">
                <label class='small' for='quantity'>Cantd</label>
                <input type='number' class='form-control form-control-sm w-25' min=0 id='quantity' name='quantity' disabled>
              </div>
              <div class="form-group">
                <label class='small' for='serial'>Serie</label>
                <input type='text' class='form-control form-control-sm' id='serial' name='serial' disabled>
              </div>
              <div class="form-group">
                <label class='small' for='receipt_date'>Recibido</label>
                <input type='date' class='form-control form-control-sm' id='receipt_date' name='receipt_date'>
              </div>
              <div class="form-group">
                <label class='small' for='commitment_date'>Compromiso</label>
                <input type='date' class='form-control form-control-sm' id='commitment_date' name='commitment_date'>
              </div>
              <div class="form-group">
                <label class='small' for='commitment_date'>Entrega</label>
                <input type='date' class='form-control form-control-sm' id='due_date' name='due_date'>
              </div>
              <div class="form-group">
                <label class="small" for="indicator">Indic.</label>
                <input type="text" class="form-control form-control-sm" id="indicator" name="indicator">
              </div>
              <div class="form-group">
                <label class="small" for="machinist">Realizó Mecánico</label>
                <input type="text" class="form-control form-control-sm" id="machinist" name="machinist">
              </div>
              <div class="form-group">
                <label class="small" for="status">Status</label>
                <input type="number" class="form-control form-control-sm w-25" min="0" id="status" name="status">
              </div>
              <div class="form-group">
                <label class='small' for='rework'>Retrabajo</label>
                <select class='form-control form-control-sm' id='rework' name='rework'>";
                  <option></option>
                  <option value="R">Sí</option>
                </select>
              <div class="form-group">
                <label class='small' for='observations'>Observaciones</label>
                <textarea rows='2' cols='45' class='form-control form-control-sm' id='observations' name='observations'></textarea>
              </div>
              <div class="form-group">
                <label class='small' for='row_color'>Status OC</label>
                <select class='form-control form-control-sm' id='row_color_single' name='row_color_single'><option></option><option value="row-pink">Entregado al cliente</option><option value="row-blue">En almacén</option><option value="row-red">Cuarentena</option></select></div><div class="form-group">
                <label class="small" for="pdf">Archivo PDF</label>
                <input type="file" id="pdf" name="pdf" formenctype="multipart/form-data" class="form-control-file"></div>                
                <input type="hidden" name="id" id="id" />
                <input type="hidden" name="updated_by" id="updated_by" value="1" />
              </div>
              <div class="modal-footer">
                <input type="submit" name="insert" id="insert" value="Modificar" class="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal  -->
    <div class="modal" id="confirmModal" style="display: none;" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Borrar orden de trabajo</h5>
            <button class="close" data-dismiss="modal">×</button>
          </div>
          <div class="modal-body">¿Desea borrar esta orden de trabajo?</div>
          <div class="container">
            <div class="d-flex row-hl">   
              <div class="mr-auto item-hl"><button class="btn btn-secondary" id="no" data-dismiss="modal">Cancelar</button></div>
              <div class="item-hl"><button class="btn btn-primary" id="yes" data-dismiss="modal">Borrar</button></div>
            </div>
          </div>
          <br>
        </div>
      </div>
    </div>

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

  <script language="JavaScript" type="text/javascript" src="js/table.js"></script>
  <script src="js/app.js"></script>
  <script src="js/easyhttp3.js"></script>

  <!-- Custom scripts for all pages-->
  <script src="js/sb-admin.min.js"></script>

  <!-- Demo scripts for this page-->
  <script src="js/demo/datatables-demo.js"></script>

</body>

</html>
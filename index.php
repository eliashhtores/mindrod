<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Acceso</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin.css" rel="stylesheet">

</head>

<body class="bg-dark">

  <div class="container">
    <div class="card card-login mx-auto mt-5">
      <div class="alert alert-danger alert-dismissable w-100 d-none" id="login-error">
        <strong>¡Error!</strong> Favor de verificar su usuario, contraseña y que su cuenta esté activa en el sistema
      </div>
      <div class="card-header">Acceso</div>
      <div class="card-body">
        <form action="index.php" method="GET">
          <div class="form-group">
            <div class="form-label-group">
              <input type="text" id="username" name="username" class="form-control" placeholder="Usuario" required="required" autofocus="autofocus">
              <label for="username">Usuario</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label-group">
              <input type="password" id="password" name="password" class="form-control" placeholder="Contraseña" required="required">
              <label for="password">Contraseña</label>
            </div>
          </div>
          <input type="submit" value="Ingresar" id="login" class="btn btn-primary btn-block">
        </form>
      </div>
    </div>
  </div>

  <script src="js/index.js"></script>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

</body>

</html>

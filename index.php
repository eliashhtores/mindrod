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

<?php

require_once('include/connect.php');
require_once('include/Session.php');

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$result = '';

if ($_POST) {
  $sth = $dbh->query("
  SELECT id, username, role_id FROM user
    WHERE username = '$username'
      AND password = PASSWORD('$password')"
  );
  $result = $sth->fetch();
}
?>

  <div class="container">
    <div class="card card-login mx-auto mt-5">
    <?php
    if ($result === FALSE && !empty($username) && !empty($password)) {
    ?>
      <div class="alert alert-danger alert-dismissable w-100">
        <button class="close" type="button" data-dismiss="alert">
          <span>&times;</span>
        </button>
        <strong>¡Error!</strong> Favor de verificar su usuario, contraseña y que su cuenta esté activa en el sistema
      </div>
    <?php
    }
    else {
      if (isset($sth)) {
        if($sth->rowCount() > 0) {
          $session = new Session($result['id'], $username, $result['role_id']);
          if ($result['role_id'] == 1) {
            header("Location: dashboard.php");
            die();
          } else {
            header("Location: table.php");
            die();
          }
        }
      }
    }

    ?>
      <div class="card-header">Acceso</div>
      <div class="card-body">
        <form action="index.php" method="POST">
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
          <input type="submit" value="Ingresar" class="btn btn-primary btn-block">
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap core JavaScript-->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Core plugin JavaScript-->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

</body>

</html>

<?php

ini_set('session.gc_maxlifetime', 360000);
session_set_cookie_params(360000);
session_start();

if ($_SESSION['authuser'] !== TRUE) {
  echo "<title>Acceso Denegado</title>";  
  echo "Su sesión ha expirado, favor de reingresar";
  echo "<br><a href='index.php'>Volver</a>";
  exit();
}
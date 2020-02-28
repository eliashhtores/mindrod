<?php
$msg = "";

$id = $_POST['id'];
$pdf = $_FILES['pdf'];

$validExtensions = array('pdf');
$path = '../../uploads/';

$pdf = $_FILES['pdf']['name'];
$tmp = $_FILES['pdf']['tmp_name'];

$ext = strtolower(pathinfo($pdf, PATHINFO_EXTENSION));
$finalFile = $id . '.pdf';
$path = $path.strtolower($finalFile);

if (in_array($ext, $validExtensions)) {
    if (move_uploaded_file($tmp, $path)) { 
        $msg = "El archivo se ha cargado exitosamente.";
        $msg = (json_encode($msg));
    } else {
        header("HTTP/1.1 500 Internal Server Error"); 
        $msg = "Error al cargar desde $tmp a $path";
    }
} else { 
    header("HTTP/1.1 500 Internal Server Error");
    $msg = "Tipo de archivo incorrecto, se espera $validExtensions[0].";
}    

echo $msg;
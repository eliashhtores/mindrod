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

if (in_array($ext, $validExtensions)) 
    if (move_uploaded_file($tmp, $path)) 
        $msg = array('status' => 1, 'message' => 'El archivo se ha cargado exitosamente', 'Path' => $path);
    else 
        $msg = array('status' => 0, 'message' => "Error al cargar desde $tmp a $path");
else 
    $msg = array("status" => 0, "message" => "Tipo de archivo incorrecto, se espera $validExtensions[0]");

echo (json_encode($msg, JSON_UNESCAPED_SLASHES));

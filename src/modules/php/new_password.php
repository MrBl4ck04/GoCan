<?php
header('Content-Type: application/json');

// Conectar a la base de datos
$conexion = pg_connect("dbname=gocan user=postgres password=admin");
if (!$conexion) {
    echo json_encode(["estado" => "error", "mensaje" => "No se pudo conectar a la base de datos"]);
    exit;
}

$email = $_POST['email'];
$newPassword = $_POST['new_password'];


// Actualizar la contraseña del usuario en la base de datos
$sql_update = "UPDATE usuario SET password = $1 WHERE email = $2";
$result_update = pg_prepare($conexion, "update_query", $sql_update);
$result_update = pg_execute($conexion, "update_query", array($newPassword, $email));

if ($result_update) {
    echo json_encode(["estado" => "success"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => "Error al actualizar la contraseña"]);
}

pg_close($conexion);

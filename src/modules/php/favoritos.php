<?php
header('Content-Type: application/json');

$host = "localhost";
$port = "5432";
$dbname = "gocan";
$username = "postgres";
$password = "admin";
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password";

try {
    $conn = new PDO($dsn);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id_usuario'])) {
        // Obtener la cantidad de productos asociados al id_usuario
        $id_usuario = $_GET['id_usuario'];
        $stmt = $conn->prepare("SELECT COUNT(*) AS cantidad FROM producto WHERE id_usuario = :id_usuario");
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        // Devolver la cantidad de productos en formato JSON
        echo json_encode($resultado);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener productos favoritos o eliminar un producto
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['id_usuario'])) {
            // Obtener productos favoritos del usuario
            $id_usuario = $data['id_usuario'];

            $stmt = $conn->prepare("SELECT id_producto, nombre, descripcion, precio, imagen FROM producto WHERE id_usuario = :id_usuario");
            $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
            $stmt->execute();

            $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($favoritos);
        } elseif (isset($data['id_producto'])) {
            // Eliminar un producto
            $id = $data['id_producto'];

            $stmt = $conn->prepare("DELETE FROM producto WHERE id_producto = :id_producto");
            $stmt->bindParam(':id_producto', $id, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Datos inválidos']);
        }
    } else {
        echo json_encode(['error' => 'Método no soportado']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
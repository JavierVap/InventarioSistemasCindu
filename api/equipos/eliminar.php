<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['rol'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit;
}

$id = (int) ($_POST['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El equipo seleccionado no es válido.']);
    exit;
}

try {
    $stmt = $pdo->prepare('DELETE FROM equipos WHERE id = :id');
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'No se encontró el equipo que desea eliminar.']);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Equipo eliminado correctamente.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al eliminar el equipo.']);
}
?>

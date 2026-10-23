<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['status' => 'error', 'mensaje' => 'Sesión no válida.']);
    exit();
}

require_once '../../config/conexion.php';

$id = intval($_POST['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['status' => 'error', 'mensaje' => 'ID no válido.']);
    exit();
}

$stmt = $conexion->prepare("DELETE FROM departamentos WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'mensaje' => 'Departamento eliminado correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'mensaje' => 'No se puede eliminar: el departamento tiene insumos asociados.']);
}
$stmt->close();
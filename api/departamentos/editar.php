<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['status' => 'error', 'mensaje' => 'Sesión no válida.']);
    exit();
}

require_once '../../config/conexion.php';

$id = intval($_POST['id'] ?? 0);
$nombre = trim($_POST['nombre'] ?? '');

if ($id <= 0 || empty($nombre)) {
    echo json_encode(['status' => 'error', 'mensaje' => 'Datos incompletos para actualizar.']);
    exit();
}

$stmt = $conexion->prepare("UPDATE departamentos SET nombre = ? WHERE id = ?");
$stmt->bind_param("si", $nombre, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'mensaje' => 'Departamento actualizado correctamente.']);
} else {
    echo json_encode(['status' => 'error', 'mensaje' => 'Error al actualizar el departamento.']);
}
$stmt->close();
<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['status' => 'error', 'mensaje' => 'Sesión no válida.']);
    exit();
}

require_once '../../config/conexion.php';

$nombre = trim($_POST['nombre'] ?? '');

if (empty($nombre)) {
    echo json_encode(['status' => 'error', 'mensaje' => 'El nombre del departamento es obligatorio.']);
    exit();
}

// Verificar duplicado
$stmt_check = $conexion->prepare("SELECT id FROM departamentos WHERE nombre = ?");
$stmt_check->bind_param("s", $nombre);
$stmt_check->execute();
if ($stmt_check->get_result()->num_rows > 0) {
    echo json_encode(['status' => 'error', 'mensaje' => 'El departamento ya se encuentra registrado.']);
    exit();
}
$stmt_check->close();

$stmt = $conexion->prepare("INSERT INTO departamentos (nombre) VALUES (?)");
$stmt->bind_param("s", $nombre);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'mensaje' => 'Departamento creado exitosamente.']);
} else {
    echo json_encode(['status' => 'error', 'mensaje' => 'Error al guardar el departamento.']);
}
$stmt->close();
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

try {
    $stmt_check = $pdo->prepare("SELECT id FROM departamentos WHERE nombre = :nombre LIMIT 1");
    $stmt_check->execute([':nombre' => $nombre]);

    if ($stmt_check->fetch()) {
        echo json_encode(['status' => 'error', 'mensaje' => 'El departamento ya se encuentra registrado.']);
        exit();
    }

    $stmt = $pdo->prepare("INSERT INTO departamentos (nombre) VALUES (:nombre)");
    $stmt->execute([':nombre' => $nombre]);

    echo json_encode(['status' => 'success', 'mensaje' => 'Departamento creado exitosamente.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'mensaje' => 'Error al guardar el departamento.']);
}
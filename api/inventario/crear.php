<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

// Validar inicio de sesión
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Sesión no iniciada.']);
    exit;
}

// Validar permisos de Administrador
if (($_SESSION['rol'] ?? '') !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acceso denegado: Se requieren permisos de Administrador.']);
    exit;
}


$nombre = trim($_POST['nombre'] ?? '');
$modelo = trim($_POST['modelo'] ?? 'N/A');
$departamento_id = intval($_POST['departamento_id'] ?? 0);
$stock = intval($_POST['stock'] ?? 0);
$minimo = intval($_POST['minimo'] ?? 1);

if (empty($nombre) || $departamento_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'El nombre y departamento son obligatorios.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO insumos (nombre, modelo, departamento_id, stock, minimo, ultimo_cambio)
        VALUES (:nombre, :modelo, :dept_id, :stock, :minimo, NULL)
    ");
    $stmt->execute([
        ':nombre' => $nombre,
        ':modelo' => empty($modelo) ? 'N/A' : $modelo,
        ':dept_id' => $departamento_id,
        ':stock' => $stock,
        ':minimo' => $minimo
    ]);

    echo json_encode(['success' => true, 'message' => 'Insumo registrado exitosamente.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al guardar insumo: ' . $e->getMessage()]);
}
?>
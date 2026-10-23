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

$id = intval($_POST['id'] ?? 0);
$nombre = trim($_POST['nombre'] ?? '');
$modelo = trim($_POST['modelo'] ?? 'N/A');
$departamento_id = intval($_POST['departamento_id'] ?? 0);
$stock = intval($_POST['stock'] ?? 0);
$minimo = intval($_POST['minimo'] ?? 1);
$ultimo_cambio = !empty($_POST['ultimo_cambio']) ? $_POST['ultimo_cambio'] : null;

if ($id <= 0 || empty($nombre) || $departamento_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Datos insuficientes para actualizar.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE insumos 
        SET nombre = :nombre, 
            modelo = :modelo, 
            departamento_id = :dept_id, 
            stock = :stock, 
            minimo = :minimo, 
            ultimo_cambio = :ultimo_cambio
        WHERE id = :id
    ");
    $stmt->execute([
        ':nombre' => $nombre,
        ':modelo' => empty($modelo) ? 'N/A' : $modelo,
        ':dept_id' => $departamento_id,
        ':stock' => $stock,
        ':minimo' => $minimo,
        ':ultimo_cambio' => $ultimo_cambio,
        ':id' => $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Insumo actualizado exitosamente.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar insumo: ' . $e->getMessage()]);
}
?>
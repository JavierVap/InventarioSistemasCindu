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

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de insumo no válido.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM insumos WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Insumo eliminado exitosamente.']);
} catch (PDOException $e) {
    // Si hay restricciones de clave foránea (auditoría en movimientos)
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'No se puede eliminar: el insumo posee historial de retiros/movimientos.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar insumo: ' . $e->getMessage()]);
    }
}
?>
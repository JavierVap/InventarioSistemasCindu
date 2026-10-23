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
    echo json_encode(['success' => false, 'message' => 'ID de usuario no válido.']);
    exit;
}

// Protección: Impedir automutilación de cuenta en uso
if ($id === intval($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No puedes eliminar la cuenta con la que has iniciado sesión.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true, 'message' => 'Usuario eliminado exitosamente.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario: ' . $e->getMessage()]);
}
?>
<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.cedula, u.nombre, u.departamento_id, d.nombre AS departamento, u.rol
        FROM usuarios u
        LEFT JOIN departamentos d ON u.departamento_id = d.id
        ORDER BY u.id DESC
    ");
    $stmt->execute();
    $usuarios = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $usuarios]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al consultar usuarios']);
}
?>
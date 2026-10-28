<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT i.id, i.nombre, i.modelo, d.nombre AS departamento, i.stock
        FROM insumos i
        LEFT JOIN departamentos d ON i.departamento_id = d.id
        ORDER BY i.id DESC
    ");

    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al consultar las opciones de inventario.']);
}
?>

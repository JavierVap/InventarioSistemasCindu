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
        SELECT i.id, i.nombre, i.modelo, d.nombre AS departamento, i.departamento_id, i.stock, i.minimo, i.ultimo_cambio
        FROM insumos i
        LEFT JOIN departamentos d ON i.departamento_id = d.id
        ORDER BY i.id DESC
    ");
    $stmt->execute();
    $insumos = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $insumos]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al consultar inventario: ' . $e->getMessage()]);
}
?>
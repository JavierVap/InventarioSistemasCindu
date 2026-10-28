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
    $totales = $pdo->query("
        SELECT COUNT(*) AS total,
               COALESCE(SUM(stock <= minimo), 0) AS alerta
        FROM insumos
    ")->fetch();

    $stmt = $pdo->query("
        SELECT COALESCE(d.nombre, 'Sin Asignar') AS departamento,
               SUM(i.stock) AS stock
        FROM insumos i
        LEFT JOIN departamentos d ON i.departamento_id = d.id
        GROUP BY d.id, d.nombre
        ORDER BY d.nombre
    ");

    $total = (int) $totales['total'];
    $alerta = (int) $totales['alerta'];

    echo json_encode([
        'success' => true,
        'data' => [
            'total' => $total,
            'alerta' => $alerta,
            'optimo' => $total - $alerta,
            'departamentos' => $stmt->fetchAll()
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al consultar el resumen del inventario.']);
}
?>

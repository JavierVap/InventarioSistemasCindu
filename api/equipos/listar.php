<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado.']);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT e.id, e.tipo, e.marca, e.numero_serial AS serial, e.departamento_id, e.usuario_id,
               e.ultima_modificacion, e.notas, d.nombre AS departamento,
               COALESCE(NULLIF(e.responsable, ''), u.nombre) AS usuario
        FROM equipos e
        INNER JOIN departamentos d ON d.id = e.departamento_id
        LEFT JOIN usuarios u ON u.id = e.usuario_id
        ORDER BY e.id DESC
    ");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al consultar los equipos.']);
}
?>

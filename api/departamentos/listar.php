<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

try {
    $stmt = $pdo->query("SELECT id, nombre FROM departamentos ORDER BY nombre ASC");
    $departamentos = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $departamentos]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener departamentos']);
}
?>
<?php
// config/conexion.php

$host = 'localhost';
$dbname = 'cindu_inventario';
$username = 'root';
$password = ''; // Coloca tu clave de MySQL si tienes una asignada

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Si falla la conexión, devuelve error JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error de conexión con la base de datos: ' . $e->getMessage()]);
    exit;
}
?>
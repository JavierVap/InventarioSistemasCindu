<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';
require_once 'validar.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['rol'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requieren permisos de administrador.']);
    exit;
}

try {
    $equipo = validarDatosEquipo($pdo);
    $stmt = $pdo->prepare("
        INSERT INTO equipos (tipo, marca, numero_serial, departamento_id, responsable, ultima_modificacion, notas)
        VALUES (:tipo, :marca, :serial, :departamento_id, :responsable, :ultima_modificacion, :notas)
    ");
    $stmt->execute([
        ':tipo' => $equipo['tipo'],
        ':marca' => $equipo['marca'],
        ':serial' => $equipo['serial'],
        ':departamento_id' => $equipo['departamento_id'],
        ':responsable' => $equipo['responsable'],
        ':ultima_modificacion' => $equipo['ultima_modificacion'],
        ':notas' => $equipo['notas']
    ]);

    echo json_encode(['success' => true, 'message' => 'Equipo registrado correctamente.']);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    $duplicado = $e->getCode() === '23000';
    http_response_code($duplicado ? 409 : 500);
    $message = $duplicado ? 'Ya existe un equipo registrado con ese serial.' : 'Error al registrar el equipo.';
    echo json_encode(['success' => false, 'message' => $message]);
}
?>

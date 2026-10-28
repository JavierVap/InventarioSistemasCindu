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

$id = (int) ($_POST['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El equipo seleccionado no es válido.']);
    exit;
}

try {
    $equipo = validarDatosEquipo($pdo);
    $stmt = $pdo->prepare("
        UPDATE equipos
        SET tipo = :tipo, marca = :marca, numero_serial = :serial,
            departamento_id = :departamento_id, responsable = :responsable, usuario_id = NULL,
            ultima_modificacion = :ultima_modificacion, notas = :notas
        WHERE id = :id
    ");
    $stmt->execute([
        ':tipo' => $equipo['tipo'],
        ':marca' => $equipo['marca'],
        ':serial' => $equipo['serial'],
        ':departamento_id' => $equipo['departamento_id'],
        ':responsable' => $equipo['responsable'],
        ':ultima_modificacion' => $equipo['ultima_modificacion'],
        ':notas' => $equipo['notas'],
        ':id' => $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Equipo actualizado correctamente.']);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    $duplicado = $e->getCode() === '23000';
    http_response_code($duplicado ? 409 : 500);
    $message = $duplicado ? 'Ya existe otro equipo registrado con ese serial.' : 'Error al actualizar el equipo.';
    echo json_encode(['success' => false, 'message' => $message]);
}
?>

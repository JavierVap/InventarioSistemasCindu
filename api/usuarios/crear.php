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

$cedula = trim($_POST['cedula'] ?? '');
$nombre = trim($_POST['nombre'] ?? '');
$password = trim($_POST['password'] ?? '');
$departamento_id = intval($_POST['departamento_id'] ?? 0);
$rol = trim($_POST['rol'] ?? 'usuario');

if (empty($cedula) || empty($nombre) || empty($password) || $departamento_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (cedula, nombre, password, departamento_id, rol)
        VALUES (:cedula, :nombre, :password, :dept_id, :rol)
    ");
    $stmt->execute([
        ':cedula' => $cedula,
        ':nombre' => $nombre,
        ':password' => $password, // Si usas hashes en el futuro: password_hash($password, PASSWORD_DEFAULT)
        ':dept_id' => $departamento_id,
        ':rol' => $rol
    ]);

    echo json_encode(['success' => true, 'message' => 'Usuario creado exitosamente.']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'El usuario/cédula ya se encuentra registrado.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar usuario: ' . $e->getMessage()]);
    }
}
?>
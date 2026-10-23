<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id']) || ($_SESSION['rol'] ?? '') !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
    exit;
}

$id = intval($_POST['id'] ?? 0);
$cedula = trim($_POST['cedula'] ?? '');
$nombre = trim($_POST['nombre'] ?? '');
$password = trim($_POST['password'] ?? ''); 
$departamento_id = intval($_POST['departamento_id'] ?? 0);
$rol = trim($_POST['rol'] ?? 'usuario');

if ($id <= 0 || empty($cedula) || empty($nombre) || $departamento_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit;
}

try {
    if (!empty($password)) {
        // Cifrar la nueva contraseña si se proporcionó una
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("
            UPDATE usuarios 
            SET cedula = :cedula, nombre = :nombre, password = :password, departamento_id = :dept_id, rol = :rol
            WHERE id = :id
        ");
        $stmt->execute([
            ':cedula' => $cedula,
            ':nombre' => $nombre,
            ':password' => $passwordHash,
            ':dept_id' => $departamento_id,
            ':rol' => $rol,
            ':id' => $id
        ]);
    } else {
        // Conservar la contraseña actual si el campo se dejó vacío
        $stmt = $pdo->prepare("
            UPDATE usuarios 
            SET cedula = :cedula, nombre = :nombre, departamento_id = :dept_id, rol = :rol
            WHERE id = :id
        ");
        $stmt->execute([
            ':cedula' => $cedula,
            ':nombre' => $nombre,
            ':dept_id' => $departamento_id,
            ':rol' => $rol,
            ':id' => $id
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Usuario actualizado exitosamente.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar usuario.']);
}
?>
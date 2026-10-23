<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

$cedula = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($cedula) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Por favor complete todos los campos.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT u.id, u.cedula, u.nombre, u.password, u.rol, d.nombre AS departamento 
        FROM usuarios u
        LEFT JOIN departamentos d ON u.departamento_id = d.id
        WHERE u.cedula = :cedula
    ");
    $stmt->execute([':cedula' => $cedula]);
    $usuario = $stmt->fetch();

    if (!$usuario) {
        echo json_encode(['success' => false, 'message' => 'El usuario no existe.']);
        exit;
    }

    // VERIFICACIÓN ESTRICTA: Solo mediante password_verify()
    if (!password_verify($password, $usuario['password'])) {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        exit;
    }

    // Regenerar ID de sesión para prevenir Session Fixation
    session_regenerate_id(true);

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['cedula'] = $usuario['cedula'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['departamento'] = $usuario['departamento'] ?? 'Sin Asignar';
    $_SESSION['rol'] = $usuario['rol'] ?? 'usuario';

    echo json_encode([
        'success' => true,
        'user' => [
            'nombre' => $_SESSION['nombre'],
            'departamento' => $_SESSION['departamento'],
            'rol' => $_SESSION['rol']
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de BD: ' . $e->getMessage()]);
}
?>
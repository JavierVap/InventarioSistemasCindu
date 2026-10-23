<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$insumo_id = intval($_POST['insumo_id'] ?? 0);
$cantidad = intval($_POST['cantidad'] ?? 0);
$usuario_id = $_SESSION['usuario_id'];

if ($insumo_id <= 0 || $cantidad <= 0) {
    echo json_encode(['success' => false, 'message' => 'Insumo o cantidad inválida.']);
    exit;
}

try {
    // 1. Validar stock disponible
    $stmt = $pdo->prepare("SELECT stock FROM insumos WHERE id = :id");
    $stmt->execute([':id' => $insumo_id]);
    $insumo = $stmt->fetch();

    if (!$insumo || $insumo['stock'] < $cantidad) {
        echo json_encode(['success' => false, 'message' => 'Error: Stock insuficiente.']);
        exit;
    }

    $pdo->beginTransaction();

    // 2. Descontar stock y actualizar fecha de cambio
    $hoy = date('Y-m-d');
    $stmtUpdate = $pdo->prepare("
        UPDATE insumos 
        SET stock = stock - :cantidad, ultimo_cambio = :fecha 
        WHERE id = :id
    ");
    $stmtUpdate->execute([
        ':cantidad' => $cantidad,
        ':fecha' => $hoy,
        ':id' => $insumo_id
    ]);

    // 3. Registrar auditoría en la tabla de movimientos
    $stmtMov = $pdo->prepare("
        INSERT INTO movimientos (insumo_id, usuario_id, cantidad, tipo) 
        VALUES (:insumo_id, :usuario_id, :cantidad, 'retiro')
    ");
    $stmtMov->execute([
        ':insumo_id' => $insumo_id,
        ':usuario_id' => $usuario_id,
        ':cantidad' => $cantidad
    ]);

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Retiro registrado exitosamente.']);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Error al procesar el retiro: ' . $e->getMessage()]);
}
?>
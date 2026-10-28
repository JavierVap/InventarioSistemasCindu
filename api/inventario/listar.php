<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/conexion.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

try {
    $consultaBase = "
        SELECT i.id, i.nombre, i.modelo, d.nombre AS departamento, i.departamento_id, i.stock, i.minimo, i.ultimo_cambio
        FROM insumos i
        LEFT JOIN departamentos d ON i.departamento_id = d.id
    ";

    if (isset($_GET['completo']) && $_GET['completo'] === '1') {
        $stmt = $pdo->query($consultaBase . " ORDER BY i.id DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        exit;
    }

    $pagina = filter_input(INPUT_GET, 'pagina', FILTER_VALIDATE_INT);
    $limite = filter_input(INPUT_GET, 'limite', FILTER_VALIDATE_INT);
    $pagina = $pagina === false || $pagina === null ? 1 : max(1, $pagina);
    $limite = $limite === false || $limite === null ? 25 : min(100, max(1, $limite));

    $total = (int) $pdo->query("SELECT COUNT(*) FROM insumos")->fetchColumn();
    $totalPaginas = max(1, (int) ceil($total / $limite));
    $pagina = min($pagina, $totalPaginas);
    $offset = ($pagina - 1) * $limite;

    $stmt = $pdo->prepare($consultaBase . " ORDER BY i.id DESC LIMIT :limite OFFSET :offset");
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'data' => $stmt->fetchAll(),
        'pagination' => [
            'page' => $pagina,
            'perPage' => $limite,
            'total' => $total,
            'totalPages' => $totalPaginas
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al consultar inventario.']);
}
?>
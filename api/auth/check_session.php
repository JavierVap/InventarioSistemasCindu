<?php
session_start();
header('Content-Type: application/json');

// Verificar si existe la variable de sesión iniciada en PHP
if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'nombre' => $_SESSION['nombre'],
            'departamento' => $_SESSION['departamento']
        ]
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>
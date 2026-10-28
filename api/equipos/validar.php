<?php
function validarDatosEquipo(PDO $pdo)
{
    $tiposPermitidos = ['PC', 'Laptop', 'Tableta'];
    $tipo = trim($_POST['tipo'] ?? '');
    $marca = trim($_POST['marca'] ?? '');
    $serial = trim($_POST['serial'] ?? '');
    $departamentoId = (int) ($_POST['departamento_id'] ?? 0);
    $responsable = trim($_POST['responsable'] ?? '');
    $fecha = trim($_POST['ultima_modificacion'] ?? '');
    $notas = trim($_POST['notas'] ?? '');

    if (!in_array($tipo, $tiposPermitidos, true) || $marca === '' || $serial === '' || $departamentoId <= 0) {
        throw new InvalidArgumentException('Tipo, marca, serial y departamento son obligatorios.');
    }

    if (strlen($marca) > 100 || strlen($serial) > 100 || strlen($responsable) > 150 || strlen($notas) > 2000) {
        throw new InvalidArgumentException('La marca, el serial, el responsable o las notas superan la longitud permitida.');
    }

    if ($fecha !== '') {
        $partesFecha = explode('-', $fecha);
        if (
            !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)
            || count($partesFecha) !== 3
            || !checkdate((int) $partesFecha[1], (int) $partesFecha[2], (int) $partesFecha[0])
        ) {
            throw new InvalidArgumentException('La fecha de última modificación no es válida.');
        }
    } else {
        $fecha = null;
    }

    $stmt = $pdo->prepare('SELECT id FROM departamentos WHERE id = :id');
    $stmt->execute([':id' => $departamentoId]);
    if (!$stmt->fetch()) {
        throw new InvalidArgumentException('El departamento seleccionado no existe.');
    }

    return [
        'tipo' => $tipo,
        'marca' => $marca,
        'serial' => $serial,
        'departamento_id' => $departamentoId,
        'responsable' => $responsable === '' ? null : $responsable,
        'ultima_modificacion' => $fecha,
        'notas' => $notas === '' ? null : $notas
    ];
}
?>

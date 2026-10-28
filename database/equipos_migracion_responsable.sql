ALTER TABLE equipos
    ADD COLUMN responsable VARCHAR(150) NULL AFTER usuario_id;

UPDATE equipos e
LEFT JOIN usuarios u ON u.id = e.usuario_id
SET e.responsable = u.nombre
WHERE e.responsable IS NULL
  AND e.usuario_id IS NOT NULL;

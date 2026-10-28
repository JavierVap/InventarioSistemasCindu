CREATE TABLE IF NOT EXISTS equipos (
    id INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(20) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    numero_serial VARCHAR(100) NOT NULL,
    departamento_id INT NOT NULL,
    usuario_id INT NULL,
    responsable VARCHAR(150) NULL,
    ultima_modificacion DATE NULL,
    notas TEXT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_equipos_serial (numero_serial),
    KEY idx_equipos_departamento (departamento_id),
    KEY idx_equipos_usuario (usuario_id),
    CONSTRAINT fk_equipos_departamento
        FOREIGN KEY (departamento_id) REFERENCES departamentos (id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_equipos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

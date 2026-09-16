CREATE DATABASE ECOLIM;
USE ECOLIM;

CREATE TABLE productos(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(60)     NOT NULL,
    categoria   VARCHAR(40)     NOT NULL,
    descripcion VARCHAR(200)    NULL,
    garantia    VARCHAR(40)     NULL,
    precio      DECIMAL(10,2)   NOT NULL,
    stock       INT             NOT NULL DEFAULT 0,
    create_at   DATETIME        NOT NULL DEFAULT NOW(),
    update_at   DATETIME        NULL
) ENGINE = INNODB;

INSERT INTO productos (nombre, categoria, descripcion, garantia, precio, stock)
    VALUES
    ('Detergente ECOLIM 1L', 'Limpieza', 'Detergente biodegradable', '6 meses', 15.90, 100),
    ('Escoba ecológica', 'Hogar', 'Fabricada con material reciclado', '1 año', 12.50, 50);
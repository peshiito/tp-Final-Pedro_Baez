-- ====================================
-- CREAR BASE DE DATOS
-- ====================================
CREATE DATABASE IF NOT EXISTS patitas_felices
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE patitas_felices;

-- ====================================
-- ROLES
-- ====================================
CREATE TABLE roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (id, nombre) VALUES
(1, 'ADMIN'),
(2, 'OWNER'),
(3, 'VETERINARIO');

-- ====================================
-- USUARIOS (LOGIN CON DNI)
-- ====================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles(id)
);

-- ====================================
-- VETERINARIOS (datos profesionales)
-- ====================================
CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vet_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- ====================================
-- DUEÑOS (NO LOGIN)
-- ====================================
CREATE TABLE duenios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- MASCOTAS
-- ====================================
CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    duenio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mascota_duenio
        FOREIGN KEY (duenio_id)
        REFERENCES duenios(id)
        ON DELETE CASCADE
);

-- ====================================
-- HISTORIALES CLINICOS
-- ====================================
CREATE TABLE historiales_clinicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    veterinario_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES mascotas(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_veterinario
        FOREIGN KEY (veterinario_id)
        REFERENCES veterinarios(id)
        ON DELETE RESTRICT
);

-- ====================================
-- INDEXES
-- ====================================
CREATE INDEX idx_mascotas_duenio ON mascotas(duenio_id);
CREATE INDEX idx_historial_mascota ON historiales_clinicos(mascota_id);
CREATE INDEX idx_historial_veterinario ON historiales_clinicos(veterinario_id);

-- ====================================
-- ADMIN PRE-CARGADO
-- DNI: 12345678
-- Password: Contraseña123@
-- ====================================

INSERT INTO usuarios (nombre, apellido, dni, email, password, rol_id)
VALUES (
    'Admin',
    'Principal',
    '12345678',
    'admin@patitas.com',
    '$2b$10$5Q0kZ7Q0O2uS0qF8rJqkXeCjv5FZrL8e3d2k9FzKJvX0P6kqS2L8O',
    1
);

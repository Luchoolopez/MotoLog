CREATE TABLE planes_mantenimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE items_plan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    tarea VARCHAR(150) NOT NULL,
    intervalo_km INT NOT NULL,
    intervalo_meses INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES planes_mantenimiento(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE motos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT,
    patente VARCHAR(20),
    km_actual INT NOT NULL DEFAULT 0,
    fecha_compra DATE,
    plan_id INT,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (plan_id) REFERENCES planes_mantenimiento(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE historial_mantenimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moto_id INT NOT NULL,
    item_plan_id INT NOT NULL,
    fecha_realizado DATE NOT NULL,
    km_realizado INT NOT NULL,
    observaciones TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE CASCADE,
    FOREIGN KEY (item_plan_id) REFERENCES items_plan(id) ON DELETE CASCADE
);

CREATE TABLE license_insurance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moto_id INT NOT NULL,
    user_id INT NOT NULL,
    tipo ENUM('Patente', 'Seguro', 'VTV') NOT NULL,
    entidad VARCHAR(255) NOT NULL,
    nro_documento VARCHAR(255) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cobertura VARCHAR(255),
    cuota VARCHAR(255),
    pagado BOOLEAN NOT NULL DEFAULT 0,
    fecha_pago DATE,
    observaciones TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE registros_combustible (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moto_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    litros FLOAT NOT NULL,
    precio_por_litro FLOAT NOT NULL,
    total FLOAT NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    km_momento INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE CASCADE
);

CREATE TABLE historial_odometro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moto_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    km INT NOT NULL,
    observaciones VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE CASCADE
);

CREATE TABLE almacen_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    nro_parte VARCHAR(255),
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    fecha_compra DATETIME NOT NULL,
    precio_compra FLOAT NOT NULL DEFAULT 0,
    lugar_compra VARCHAR(255),
    cantidad INT NOT NULL DEFAULT 1,
    stock_actual INT NOT NULL DEFAULT 1,
    modelo_moto VARCHAR(255),
    observaciones TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE fines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    moto_id INT NOT NULL,
    type ENUM('Multa', 'Service', 'Otro') NOT NULL DEFAULT 'Multa',
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    status ENUM('Pendiente', 'Pagado', 'Apelado', 'Anulado') NOT NULL DEFAULT 'Pendiente',
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE CASCADE
);

CREATE TABLE item_plan_warehouse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_plan_id INT NOT NULL,
    warehouse_item_id INT NOT NULL,
    cantidad_sugerida INT NOT NULL DEFAULT 1,
    FOREIGN KEY (item_plan_id) REFERENCES items_plan(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_item_id) REFERENCES almacen_items(id) ON DELETE CASCADE
);

CREATE TABLE historial_mantenimiento_consumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    maintenance_history_id INT NOT NULL,
    warehouse_item_id INT NOT NULL,
    cantidad_usada INT NOT NULL DEFAULT 1,
    FOREIGN KEY (maintenance_history_id) REFERENCES historial_mantenimiento(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_item_id) REFERENCES almacen_items(id) ON DELETE CASCADE
);
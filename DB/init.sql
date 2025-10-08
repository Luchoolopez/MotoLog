-- MOTOS
CREATE TABLE motorcycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  brand VARCHAR(100),
  model VARCHAR(100),
  year INT,
  current_km INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TAREAS DE MANTENIMIENTO
CREATE TABLE maintenances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item VARCHAR(150) NOT NULL,          -- Ej: "Engine Oil"
  description TEXT,
  category ENUM('EMISSION', 'NON-EMISSION') NULL,
  default_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INTERVALOS por mantenimiento y modelo
CREATE TABLE maintenance_intervals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  model VARCHAR(100) NOT NULL,         -- Ej: 'CBR300', 'NINJA'
  action_set VARCHAR(50) NOT NULL,     -- Ej: 'I', 'R', 'L', 'I+L'
  interval_km INT NULL,                -- cada X km
  interval_months INT NULL,            -- cada N meses
  first_due_km INT NULL,
  note VARCHAR(255),
  FOREIGN KEY (maintenance_id) REFERENCES maintenances(id) ON DELETE CASCADE
);

-- REGISTROS de mantenimientos realizados
CREATE TABLE completed_maintenances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  motorcycle_id INT NOT NULL,
  maintenance_interval_id INT NOT NULL,
  km_performed INT NOT NULL,
  performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id),
  FOREIGN KEY (maintenance_interval_id) REFERENCES maintenance_intervals(id)
);

CREATE TABLE actions (
  code CHAR(1) PRIMARY KEY,         -- I, R, L, A, C, etc.
  meaning VARCHAR(30) NOT NULL      -- Inspect, Replace, Lubricate...
);

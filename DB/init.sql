-- motos
CREATE TABLE motorcycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  brand VARCHAR(100),
  model VARCHAR(100),
  year INT,
  current_km INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- mantenimientos "concepto"
CREATE TABLE maintenances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item VARCHAR(150) NOT NULL,        -- ej "Engine Oil"
  description TEXT,
  notes TEXT
);

-- intervalos por cada concepto (permite múltiples reglas: cada X km, o cada N meses)
CREATE TABLE maintenance_intervals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  maintenance_id INT NOT NULL,
  action VARCHAR(10) NOT NULL,       -- 'I','R','L','A','C'
  interval_km INT NULL,              -- si es periódico en km (ej 800, 6400)
  interval_months INT NULL,          -- si es por tiempo (ej 24 months para brake fluid)
  first_due_km INT NULL,             -- opcional, primer km donde empieza el ciclo
  note VARCHAR(255),
  FOREIGN KEY (maintenance_id) REFERENCES maintenances(id) ON DELETE CASCADE
);

-- registros de mantenimientos realizados sobre una moto
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

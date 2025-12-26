INSERT INTO maintenances (item, description, notes) VALUES
('Spark Plug','Bujía','Inspect and Replace according to intervals'),
('Exhaust Gas Control Valve Cable','Cable de la válvula de control de gases','Inspect every 25,600 km'),
('Drive Chain','Cadena de transmisión','Inspect and lubricate every 800 km'),
('Brake Fluid','Líquido de frenos','Replace every 2 years (note 3)');

-- ahora intervals
-- Spark plug
INSERT INTO maintenance_intervals (maintenance_id, action, interval_km, note) VALUES
((SELECT id FROM maintenances WHERE item='Spark Plug'), 'I', 25600, 'Inspect'),
((SELECT id FROM maintenances WHERE item='Spark Plug'), 'R', 51200, 'Replace');

-- Exhaust gas control valve cable
INSERT INTO maintenance_intervals (maintenance_id, action, interval_km, note) VALUES
((SELECT id FROM maintenances WHERE item='Exhaust Gas Control Valve Cable'), 'I', 25600, 'Inspect');

-- Drive chain
INSERT INTO maintenance_intervals (maintenance_id, action, interval_km, note) VALUES
((SELECT id FROM maintenances WHERE item='Drive Chain'), 'I', 800, 'Inspect'),
((SELECT id FROM maintenances WHERE item='Drive Chain'), 'L', 800, 'Lubricate');

-- Brake fluid (por tiempo)
INSERT INTO maintenance_intervals (maintenance_id, action, interval_months, note) VALUES
((SELECT id FROM maintenances WHERE item='Brake Fluid'), 'R', 24, 'Replace every 2 years (or when indicated)');

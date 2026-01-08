-- Migration: Add cobertura column to license_insurance table
-- Date: 2026-01-08
-- Description: Adds a cobertura (coverage) field to store insurance coverage type

ALTER TABLE license_insurance 
ADD COLUMN cobertura VARCHAR(255) NULL AFTER monto;

-- Update existing Seguro records to have a default value if needed
-- UPDATE license_insurance SET cobertura = 'No especificada' WHERE tipo = 'Seguro' AND cobertura IS NULL;

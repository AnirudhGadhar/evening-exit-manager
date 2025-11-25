-- Parking Management System Database Schema
-- Run this SQL in MySQL Workbench to create the database and table

-- Create database
CREATE DATABASE IF NOT EXISTS parking_management;
USE parking_management;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    owner_name VARCHAR(100) NOT NULL,
    vehicle_type ENUM('Car', 'Bike', 'Truck', 'Other') NOT NULL,
    phone_number VARCHAR(15),
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicle_number (vehicle_number),
    INDEX idx_entry_time (entry_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Create a view for quick stats
CREATE OR REPLACE VIEW vehicle_stats AS
SELECT 
    COUNT(*) as total_vehicles,
    SUM(CASE WHEN vehicle_type = 'Car' THEN 1 ELSE 0 END) as total_cars,
    SUM(CASE WHEN vehicle_type = 'Bike' THEN 1 ELSE 0 END) as total_bikes,
    SUM(CASE WHEN vehicle_type = 'Truck' THEN 1 ELSE 0 END) as total_trucks,
    SUM(CASE WHEN vehicle_type = 'Other' THEN 1 ELSE 0 END) as total_others
FROM vehicles;

-- Optional: Insert some sample data for testing
-- INSERT INTO vehicles (vehicle_number, owner_name, vehicle_type, phone_number) VALUES
-- ('MH12AB1234', 'John Doe', 'Car', '9876543210'),
-- ('MH14CD5678', 'Jane Smith', 'Bike', '9876543211'),
-- ('MH15EF9012', 'Bob Johnson', 'Truck', '9876543212');

-- Verify the table was created
SELECT * FROM vehicles;

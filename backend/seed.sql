-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS discussions;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Patient', 'Doctor') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table (references users)
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience INT DEFAULT 0,
  fees INT DEFAULT 0,
  availability VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create posts table
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) DEFAULT 'Admin',
  category VARCHAR(100),
  summary TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table (references posts and users)
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create services table
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact messages table
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create discussions table (references users)
CREATE TABLE discussions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  topic VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create appointments table (references doctors and users)
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(50) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users (Patients and Doctors)
INSERT INTO users (name, email, password, role, created_at) VALUES
('John Patient', 'john@patient.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Patient', NOW()),
('Sarah Patient', 'sarah@patient.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Patient', NOW()),
('Mike Patient', 'mike@patient.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Patient', NOW()),
('Dr. Ahmed', 'ahmed@doctor.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Doctor', NOW()),
('Dr. Fatima', 'fatima@doctor.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Doctor', NOW()),
('Dr. Hassan', 'hassan@doctor.com', '$2a$10$cQmgYsxASEBdbWDlVQEB3ODWD4F84BX/Ar/PEei9iH.ln0FW/lOge', 'Doctor', NOW()),
('Dr. Ali', 'ali@doctor.com', '$2a$10$0AzAIQ.5dBy4w9a3lIU...7fINJ9RBwjrSyHbfYjXr6eIsEphHmTm', 'Doctor', NOW());

-- Insert sample doctors (linked to users)
INSERT INTO doctors (user_id, specialization, experience, fees, availability) VALUES
(4, 'Cardiology', 10, 500, 'Monday to Friday, 9AM-5PM'),
(5, 'General Practice', 5, 300, 'Monday to Saturday, 10AM-6PM'),
(6, 'Pediatrics', 8, 400, 'Tuesday to Friday, 2PM-8PM'),
(7, 'Neurology', 12, 600, 'Monday to Friday, 11AM-7PM');

-- Insert sample posts
INSERT INTO posts (title, author, category, summary, content, created_at) VALUES
('Understanding Diabetes Type 2', 'Dr. Ahmed', 'Diabetes', 'A new study shows the impact of diet and exercise...', 'Full article content about diabetes management and lifestyle changes goes here...', NOW()),
('Heart Health Tips', 'Dr. Fatima', 'Cardiology', 'How to take care of your heart in simple steps...', 'Full article about cardiovascular health, exercise routines, and dietary recommendations goes here...', NOW()),
('Pediatric Care Guide', 'Dr. Hassan', 'Pediatrics', 'Essential guide for parents on child health...', 'Comprehensive guide for parents covering vaccinations, nutrition, and developmental milestones goes here...', NOW());

-- Insert sample services
INSERT INTO services (title, description, created_at) VALUES
('Online Consultation', 'Connect with certified doctors via video call for quick consultations', NOW()),
('Appointment Booking', 'Schedule appointments with doctors at your convenience', NOW()),
('Health Articles', 'Read medical updates and health tips from certified professionals', NOW()),
('Discussion Forum', 'Connect with other patients and doctors to discuss health topics', NOW()),
('Medical Records', 'Securely store and access your medical history', NOW());

-- Insert sample discussions
INSERT INTO discussions (user_id, topic, created_at) VALUES
(1, 'Best practices for managing type 2 diabetes', NOW()),
(2, 'How often should I get health checkups?', NOW()),
(3, 'Any recommendations for heart-healthy diet?', NOW()),
(4, 'Latest treatments in cardiology', NOW());

-- Insert sample appointments
INSERT INTO appointments (doctor_id, patient_id, appointment_date, appointment_time, status, created_at) VALUES
(1, 1, '2024-01-15', '10:00 AM', 'confirmed', NOW()),
(1, 2, '2024-01-15', '10:30 AM', 'confirmed', NOW()),
(2, 3, '2024-01-16', '02:00 PM', 'pending', NOW()),
(2, 1, '2024-01-18', '03:00 PM', 'confirmed', NOW()),
(3, 2, '2024-01-20', '04:00 PM', 'cancelled', NOW()),
(3, 3, '2024-01-22', '05:00 PM', 'confirmed', NOW());

-- Insert sample comments
INSERT INTO comments (post_id, user_id, text, created_at) VALUES
(1, 2, 'This is very helpful! I have been struggling with diabetes management.', NOW()),
(1, 3, 'Great article! The exercise tips are exactly what I needed.', NOW()),
(2, 1, 'Dr. Fatima explains complex concepts so clearly.', NOW()),
(3, 2, 'As a parent, this guide is invaluable. Thank you!', NOW());

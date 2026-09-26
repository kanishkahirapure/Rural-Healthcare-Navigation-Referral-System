-- ============================
-- DATABASE 1: user_db
-- ============================
CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'HEALTH_WORKER', 'ADMIN') NOT NULL,
    phone VARCHAR(15),
    location VARCHAR(150),
    age INT,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================
-- DATABASE 2: core_db
-- ============================
CREATE DATABASE IF NOT EXISTS core_db;
USE core_db;

CREATE TABLE facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('PHC', 'DISTRICT_HOSPITAL', 'SPECIALIST_HOSPITAL', 'CLINIC') NOT NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    address VARCHAR(255),
    operating_status ENUM('OPEN', 'CLOSED', 'EMERGENCY_ONLY') DEFAULT 'OPEN',
    contact_number VARCHAR(15),
    accepts_govt_scheme BOOLEAN DEFAULT FALSE
);

CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    specialist_available BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(150),
    experience_years INT,
    available_days VARCHAR(100),
    available_time VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

CREATE TABLE referrals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    from_facility_id BIGINT,
    to_facility_id BIGINT NOT NULL,
    reason VARCHAR(255),
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (to_facility_id) REFERENCES facilities(id)
);

CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    facility_id BIGINT NOT NULL,
    doctor_id BIGINT,
    appointment_date DATETIME NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facility_id) REFERENCES facilities(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    type ENUM('REFERRAL', 'APPOINTMENT', 'EMERGENCY', 'GENERAL') DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
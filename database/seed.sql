-- Seed data for core_db (demo facilities and doctors, Nagpur / Vidarbha region)
-- Run this AFTER core-service has started once, so Hibernate has created the tables.
-- Run only once: running it again will insert duplicate rows.

USE core_db;

-- Facilities (ids 1 to 12 follow the insert order)
INSERT INTO facilities (name, type, latitude, longitude, address, operating_status, contact_number, accepts_govt_scheme) VALUES
('Kalmeshwar PHC', 'PHC', 21.2340, 78.9130, 'Kalmeshwar, Nagpur', 'OPEN', '0712100001', true),
('Hingna Primary Health Centre', 'PHC', 21.1000, 78.9800, 'Hingna, Nagpur', 'OPEN', '0712100002', true),
('Katol Rural Hospital', 'PHC', 21.2700, 78.5880, 'Katol, Nagpur', 'OPEN', '0712100003', true),
('Umred Community Clinic', 'CLINIC', 20.8500, 79.3270, 'Umred, Nagpur', 'OPEN', '0712100004', false),
('Kamptee Sub-District Hospital', 'DISTRICT_HOSPITAL', 21.2190, 79.2000, 'Kamptee, Nagpur', 'OPEN', '0712100005', true),
('Kasturba Hospital Nagpur', 'DISTRICT_HOSPITAL', 21.1458, 79.0882, 'Sitabuldi, Nagpur', 'OPEN', '0712100006', true),
('Government Medical College and Hospital', 'SPECIALIST_HOSPITAL', 21.1290, 79.0950, 'Medical Square, Nagpur', 'OPEN', '0712100007', true),
('Indira Gandhi Govt Medical College', 'SPECIALIST_HOSPITAL', 21.1160, 79.0640, 'Mayo, Nagpur', 'OPEN', '0712100008', true),
('Wardha District Hospital', 'DISTRICT_HOSPITAL', 20.7453, 78.6022, 'Wardha', 'OPEN', '0715200009', true),
('Ramtek Cottage Hospital', 'PHC', 21.3940, 79.3260, 'Ramtek, Nagpur', 'EMERGENCY_ONLY', '0712100010', true),
('Mauda Rural Clinic', 'CLINIC', 21.1770, 79.3820, 'Mauda, Nagpur', 'CLOSED', '0712100011', false),
('Nagpur Heart and Cardiac Centre', 'SPECIALIST_HOSPITAL', 21.1500, 79.0800, 'Dhantoli, Nagpur', 'OPEN', '0712100012', false);

-- Doctors (facility_id refers to the facility order above)
INSERT INTO doctors (facility_id, name, specialization, qualification, experience_years, available_days, available_time, is_available) VALUES
(1, 'Dr. Sunita Patil', 'General Physician', 'MBBS', 8, 'Mon,Tue,Wed,Thu,Fri', '09:00 AM - 02:00 PM', true),
(2, 'Dr. Ramesh Kale', 'General Physician', 'MBBS', 5, 'Mon,Wed,Fri', '10:00 AM - 03:00 PM', true),
(3, 'Dr. Anita Deshmukh', 'Gynecology', 'MBBS, DGO', 10, 'Mon,Tue,Thu,Sat', '09:00 AM - 01:00 PM', true),
(4, 'Dr. Vijay More', 'Pediatrics', 'MBBS, DCH', 7, 'Tue,Thu,Sat', '04:00 PM - 08:00 PM', true),
(5, 'Dr. Prakash Joshi', 'General Surgery', 'MS', 15, 'Mon,Tue,Wed,Thu,Fri', '09:00 AM - 04:00 PM', true),
(5, 'Dr. Meena Rao', 'Gynecology', 'MD, DGO', 12, 'Mon,Wed,Fri', '10:00 AM - 02:00 PM', true),
(6, 'Dr. Sanjay Gupta', 'Orthopedics', 'MS Ortho', 14, 'Mon,Tue,Thu,Fri', '10:00 AM - 04:00 PM', true),
(6, 'Dr. Neha Kulkarni', 'Pediatrics', 'MD Pediatrics', 9, 'Mon,Tue,Wed,Thu,Fri', '09:00 AM - 01:00 PM', true),
(7, 'Dr. Arvind Sharma', 'Cardiology', 'DM Cardiology', 20, 'Mon,Wed,Fri', '09:00 AM - 03:00 PM', true),
(7, 'Dr. Kavita Nair', 'Neurology', 'DM Neurology', 16, 'Tue,Thu,Sat', '10:00 AM - 02:00 PM', true),
(8, 'Dr. Rajesh Bhoyar', 'Dermatology', 'MD Dermatology', 11, 'Mon,Tue,Wed,Thu,Fri', '11:00 AM - 04:00 PM', true),
(8, 'Dr. Smita Ingle', 'Ophthalmology', 'MS Ophthalmology', 13, 'Mon,Wed,Fri', '09:00 AM - 01:00 PM', true),
(9, 'Dr. Ashok Wankhede', 'General Physician', 'MD Medicine', 18, 'Mon,Tue,Wed,Thu,Fri,Sat', '09:00 AM - 05:00 PM', true),
(9, 'Dr. Pooja Raut', 'Pediatrics', 'MD Pediatrics', 6, 'Mon,Tue,Thu', '10:00 AM - 02:00 PM', false),
(10, 'Dr. Dinesh Thakre', 'Emergency Medicine', 'MD', 9, 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', '24 hours', true),
(12, 'Dr. Mahesh Agrawal', 'Cardiology', 'DM Cardiology', 22, 'Mon,Tue,Wed,Thu,Fri', '09:00 AM - 05:00 PM', true);

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;
DROP TABLE IF EXISTS plan_purchases CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'teacher', 'admin')),
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    fcm_token VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ==========================================
-- PLANS TABLE
-- ==========================================
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    price_note VARCHAR(50),
    gst_note VARCHAR(100),
    description TEXT,
    features JSONB NOT NULL, -- Array of features with text and icon
    button_text VARCHAR(100) DEFAULT 'Choose Plan',
    duration_days INTEGER NOT NULL DEFAULT 30, -- Duration in days (e.g., 30, 90, 365)
    is_highlighted BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_active ON plans(is_active);
CREATE INDEX idx_plans_highlighted ON plans(is_highlighted);

-- ==========================================
-- COURSES TABLE
-- ==========================================
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500), -- URL or path to course thumbnail image
    icon VARCHAR(500), -- URL or path to icon
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(100), -- e.g., "8 weeks", "40 hours"
    duration_days INTEGER DEFAULT 30, -- Number of days user has access to the course
    level VARCHAR(50) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(100),
    objectives JSONB, -- Array of learning objectives
    curriculum JSONB, -- Structured curriculum data
    curriculum_url VARCHAR(500), -- URL to download curriculum PDF
    tools JSONB, -- Array of tools/technologies
    is_active BOOLEAN DEFAULT true,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_level ON courses(level);

-- ==========================================
-- PLAN PURCHASES TABLE
-- ==========================================
CREATE TABLE plan_purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- For subscription-based plans
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(customer_id, plan_id, purchased_at)
);

CREATE INDEX idx_plan_purchases_customer ON plan_purchases(customer_id);
CREATE INDEX idx_plan_purchases_plan ON plan_purchases(plan_id);
CREATE INDEX idx_plan_purchases_status ON plan_purchases(payment_status);

-- ==========================================
-- COURSE PURCHASES TABLE
-- ==========================================
CREATE TABLE course_purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255) UNIQUE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Course access expiration timestamp
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(customer_id, course_id)
);

CREATE INDEX idx_course_purchases_customer ON course_purchases(customer_id);
CREATE INDEX idx_course_purchases_course ON course_purchases(course_id);
CREATE INDEX idx_course_purchases_status ON course_purchases(payment_status);

-- ==========================================
-- CATEGORIES TABLE
-- ==========================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50) DEFAULT 'bg-white',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_active ON categories(is_active);

-- ==========================================
-- ACHIEVEMENTS TABLE
-- ==========================================
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_order ON achievements(display_order);
CREATE INDEX idx_achievements_active ON achievements(is_active);

-- ==========================================
-- TRAINERS TABLE
-- ==========================================
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    modules INTEGER DEFAULT 0,
    students INTEGER DEFAULT 0,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trainers_user ON trainers(user_id);
CREATE INDEX idx_trainers_active ON trainers(is_active);
CREATE INDEX idx_trainers_order ON trainers(display_order);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check course purchase limit (max 5 active courses per customer)
CREATE OR REPLACE FUNCTION check_course_purchase_limit()
RETURNS TRIGGER AS $$
DECLARE
    purchase_count INTEGER;
BEGIN
    -- Count only active (non-expired) approved purchases for this customer
    SELECT COUNT(*) INTO purchase_count
    FROM course_purchases
    WHERE customer_id = NEW.customer_id
    AND payment_status = 'completed'
    AND approval_status = 'approved'
    AND expires_at > CURRENT_TIMESTAMP;

    -- Check if limit exceeded
    IF purchase_count >= 5 THEN
        RAISE EXCEPTION 'Customer has reached the maximum limit of 5 active course purchases';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce course purchase limit
CREATE TRIGGER enforce_course_purchase_limit
    BEFORE INSERT ON course_purchases
    FOR EACH ROW EXECUTE FUNCTION check_course_purchase_limit();

-- ==========================================
-- INITIAL SEED DATA
-- ==========================================

-- Insert default admin user (password: admin123 - bcrypt hashed)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@ezyskills.com', '$2b$10$O.mHDhsXlDVDWTDAdGTFzO0PQsHes8E5as5Div9kWJbLQ0xwIfsIS', 'Admin User', 'admin');

-- Insert trainers/teachers
INSERT INTO users (email, password, full_name, role, phone) VALUES
('sandeep@ezyskills.com', '$2b$10$O.mHDhsXlDVDWTDAdGTFzO0PQsHes8E5as5Div9kWJbLQ0xwIfsIS', 'Sandeep', 'teacher', '+91-9876543210'),
('sudhansu@ezyskills.com', '$2b$10$O.mHDhsXlDVDWTDAdGTFzO0PQsHes8E5as5Div9kWJbLQ0xwIfsIS', 'Sudhansu', 'teacher', '+91-9876543211'),
('ruchika@ezyskills.com', '$2b$10$O.mHDhsXlDVDWTDAdGTFzO0PQsHes8E5as5Div9kWJbLQ0xwIfsIS', 'Ruchika Tuteja', 'teacher', '+91-9876543212');

-- Insert pricing plans
INSERT INTO plans (title, price, price_note, gst_note, description, features, button_text, is_highlighted, is_active) VALUES
('COLLEGE PROGRAM', 20000.00, '+ Tax', '(Inclusive of GST + Taxes)', 'Perfect for colleges, universities & groups', 
'[{"text": "For Colleges, Universities & Group of Students", "icon": "house"}, {"text": "Common Timings", "icon": "calender"}]'::jsonb, 
'Choose Plan', false, true),

('EMPLOYEE PROGRAM', 50000.00, '+ Tax', '(Inclusive of GST + Taxes)', 'Best for working professionals', 
'[{"text": "1-1 Individuals", "icon": "people"}, {"text": "Choose Timings", "icon": "calender"}]'::jsonb, 
'Choose Plan', true, true),

('COMPLETE TRANSFORMATION PROGRAM', 75000.00, '+ Tax', '(Inclusive of GST + Taxes)', 'Complete career transformation package', 
'[{"text": "1 Individuals", "icon": "people"}, {"text": "Flexible Timings", "icon": "calender"}]'::jsonb, 
'Choose Plan', false, true);

-- Insert courses with proper teacher references
INSERT INTO courses (title, description, icon, price, duration, level, category, curriculum_url, is_active, teacher_id) VALUES
('Angular JS', 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor', 'angular.svg', 15000.00, '8 weeks', 'Intermediate', 'Frontend Development', 'https://example.com/curriculum/angular.pdf', true, 2),
('AWS', 'AWS Certified Solutions Architect - Associate (SAA-C03) Exam Prep', 'aws.svg', 25000.00, '10 weeks', 'Advanced', 'Cloud Computing', 'https://example.com/curriculum/aws.pdf', true, 3),
('Vue JS', 'An open-source, model-view-view model JavaScript framework', 'vue.svg', 14000.00, '6 weeks', 'Intermediate', 'Frontend Development', 'https://example.com/curriculum/vue.pdf', true, 4),
('Power BI', 'An interactive data visualization software product developed', 'powerBi.svg', 18000.00, '5 weeks', 'Beginner', 'Data Science', 'https://example.com/curriculum/powerbi.pdf', true, 2),
('Python', 'Python is a high level, general-purpose programming language', 'python.svg', 20000.00, '12 weeks', 'Beginner', 'Programming', 'https://example.com/curriculum/python.pdf', true, 2),
('React JS', 'React.js is an open-source JavaScript library front-end', 'react.svg', 16000.00, '8 weeks', 'Intermediate', 'Frontend Development', 'https://example.com/curriculum/react.pdf', true, 4),
('Software Testing', 'Software testing is the process of evaluating and verifying', 'testing.svg', 12000.00, '7 weeks', 'Beginner', 'Software Testing', 'https://example.com/curriculum/testing.pdf', true, 2),
('Core UI', 'Learning the Idea behind Design User Interface and how to code', 'coreui.svg', 13000.00, '6 weeks', 'Beginner', 'UI/UX Design', 'https://example.com/curriculum/coreui.pdf', true, 4);

-- Insert categories
INSERT INTO categories (name, color, is_active) VALUES
('Cloud Computing', 'bg-[#FF6B35]', true),
('Cyber Security', 'bg-white', true),
('Devops', 'bg-white', true),
('Data Science', 'bg-white', true),
('Software Testing', 'bg-white', true);

-- Insert achievements
INSERT INTO achievements (number, label, icon, display_order, is_active) VALUES
('100', 'Students Trained', '🎓', 1, true),
('50', 'Courses Available', '📚', 2, true),
('70%', 'Students Secured Jobs in Level 1 Companies', '💼', 3, true);

-- Insert trainers
INSERT INTO trainers (user_id, name, title, description, rating, reviews, modules, students, display_order, is_active) VALUES
(2, 'Sandeep', 'Test & Azure', 'Sandeep is a Software Developer who promised to .NET & Azure for more than 24 years and training 1000''s of students in automation (WA, Appt, & Steams).', 4.5, 72, 19, 275, 1, true),
(3, 'Sudhansu', 'Cloud & Cyber Security, Forensic', 'Sudhansu is a Software Developer who promised to Cloud security, Cyber Security, Data Crime & Forensic for more than 22 years with having 100''s of students in automation (WA, great & Steams).', 4.5, 38, 17, 168, 2, true),
(4, 'Ruchika Tuteja', 'UI/UX Trainer', 'Have 8 years of experience in Fullstack development. Have worked on both front end and backend on automation of Social article development (angulaJS) and framework for news of delicate projects. Can provide portfolio.', 4.5, 60, 44, 212, 3, true);

-- ==========================================
-- MIGRATIONS / SCHEMA UPDATES
-- ==========================================
-- Note: These are ALTER TABLE commands for existing databases.
-- For fresh installations, the columns are already included in the CREATE TABLE statements above.

-- Add duration_days to courses table (if not exists)
-- ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30;

-- Add expires_at to course_purchases table (if not exists)
-- ALTER TABLE course_purchases ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;


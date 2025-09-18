import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "telemedicine")

def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

def get_sys_conn():
    return pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, cursorclass=pymysql.cursors.DictCursor)

def get_conn():
    return pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME, cursorclass=pymysql.cursors.DictCursor)

def ensure_database_and_tables():
    sys_conn = get_sys_conn()
    cur = sys_conn.cursor()
    cur.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` DEFAULT CHARACTER SET utf8mb4")
    sys_conn.commit()
    cur.close(); sys_conn.close()

    cn = get_conn()
    cur = cn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS accounts (
            phone VARCHAR(15) PRIMARY KEY,
            pin_hash VARCHAR(255) NOT NULL,
            name VARCHAR(100),
            role ENUM('patient','doctor') DEFAULT 'patient',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id CHAR(36) PRIMARY KEY,
            phone VARCHAR(15),
            name VARCHAR(100),
            age INT,
            gender VARCHAR(10),
            blood_group VARCHAR(5),
            current_medications TEXT,
            medical_history TEXT,
            relation VARCHAR(50),
            patient_phone VARCHAR(15),
            profile_image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (phone) REFERENCES accounts(phone) ON DELETE CASCADE
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS consultations (
            consultation_id CHAR(36) PRIMARY KEY,
            patient_id CHAR(36),
            doctor_id VARCHAR(15),
            symptoms TEXT,
            meeting_link VARCHAR(500),
            status VARCHAR(20) DEFAULT 'pending',
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            chat_id CHAR(36) PRIMARY KEY,
            consultation_id CHAR(36),
            patient_id CHAR(36),
            sender VARCHAR(20),
            message TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (consultation_id) REFERENCES consultations(consultation_id) ON DELETE CASCADE,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
        )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_number INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    status ENUM('pending', 'served', 'cancelled') DEFAULT 'pending',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    """)
    
    # Pharmacy tables for rural healthcare
    cur.execute("""
        CREATE TABLE IF NOT EXISTS pharmacies (
            pharmacy_id CHAR(36) PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            address TEXT NOT NULL,
            phone VARCHAR(15),
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            is_open BOOLEAN DEFAULT TRUE,
            open_hours VARCHAR(100),
            rating DECIMAL(3, 2) DEFAULT 0.0,
            reviews_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS pharmacy_stock (
            stock_id CHAR(36) PRIMARY KEY,
            pharmacy_id CHAR(36),
            medicine_name VARCHAR(200) NOT NULL,
            available BOOLEAN DEFAULT TRUE,
            price DECIMAL(10, 2),
            quantity_available INT DEFAULT 0,
            quantity_description VARCHAR(100),
            expiry_date DATE,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(pharmacy_id) ON DELETE CASCADE
        )
    """)
    
    # Symptom analysis history
    cur.execute("""
        CREATE TABLE IF NOT EXISTS symptom_analyses (
            analysis_id CHAR(36) PRIMARY KEY,
            patient_id CHAR(36),
            symptoms JSON,
            recommendation JSON,
            confidence_score DECIMAL(5, 2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
        )
    """)
    
    cn.commit()
    cur.close(); cn.close()

ensure_database_and_tables()

import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "rishu")
DB_NAME = os.getenv("DB_NAME", "telemedicine")

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
    cn.commit()
    cur.close(); cn.close()

ensure_database_and_tables()

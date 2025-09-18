#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_conn, ensure_database_and_tables

def test_database():
    print("Testing database connection and schema...")
    
    try:
        # Ensure database and tables exist
        ensure_database_and_tables()
        print("✓ Database and tables created/verified")
        
        # Test connection
        cn = get_conn()
        cur = cn.cursor()
        
        # Show tables
        cur.execute("SHOW TABLES")
        tables = cur.fetchall()
        print(f"✓ Tables found: {[t['Tables_in_telemedicine'] for t in tables]}")
        
        # Show patients table schema
        cur.execute("DESCRIBE patients")
        schema = cur.fetchall()
        print("✓ Patients table schema:")
        for field in schema:
            print(f"  - {field['Field']}: {field['Type']} ({field['Null']}, {field['Key']})")
        
        # Test inserting a sample patient
        import uuid
        pid = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO patients (patient_id, phone, name, age, gender, blood_group, current_medications, medical_history, relation, patient_phone, profile_image)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (pid, "1234567890", "Test Patient", 25, "Male", "O+", "", "", "Self", "1234567890", ""))
        
        cn.commit()
        print("✓ Sample patient inserted successfully")
        
        # Clean up test data
        cur.execute("DELETE FROM patients WHERE patient_id = %s", (pid,))
        cn.commit()
        print("✓ Test data cleaned up")
        
        cur.close()
        cn.close()
        print("✓ Database test completed successfully!")
        
    except Exception as e:
        print(f"✗ Database test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_database()
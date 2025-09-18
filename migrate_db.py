#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_conn

def migrate_database():
    print("Migrating database to add new columns...")
    
    try:
        cn = get_conn()
        cur = cn.cursor()
        
        # Check if new columns exist
        cur.execute("DESCRIBE patients")
        columns = [col['Field'] for col in cur.fetchall()]
        print(f"Current columns: {columns}")
        
        # Add missing columns
        if 'relation' not in columns:
            print("Adding 'relation' column...")
            cur.execute("ALTER TABLE patients ADD COLUMN relation VARCHAR(50) DEFAULT 'Self'")
            
        if 'patient_phone' not in columns:
            print("Adding 'patient_phone' column...")
            cur.execute("ALTER TABLE patients ADD COLUMN patient_phone VARCHAR(15)")
            
        if 'profile_image' not in columns:
            print("Adding 'profile_image' column...")
            cur.execute("ALTER TABLE patients ADD COLUMN profile_image TEXT")
            
        if 'created_at' not in columns:
            print("Adding 'created_at' column...")
            cur.execute("ALTER TABLE patients ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        
        cn.commit()
        
        # Verify the changes
        cur.execute("DESCRIBE patients")
        new_columns = [col['Field'] for col in cur.fetchall()]
        print(f"Updated columns: {new_columns}")
        
        # Update existing records to have default values
        print("Updating existing records with default values...")
        cur.execute("""
            UPDATE patients 
            SET relation = 'Self', patient_phone = phone 
            WHERE relation IS NULL OR relation = ''
        """)
        cn.commit()
        
        cur.close()
        cn.close()
        print("✓ Database migration completed successfully!")
        
    except Exception as e:
        print(f"✗ Database migration failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    migrate_database()
#!/usr/bin/env python3

import requests
import json

def fix_and_test_registration():
    print("Fixing and testing registration...")
    
    base_url = "http://localhost:5000/api"
    
    try:
        # 1. Test health endpoint
        print("1. Testing health endpoint...")
        health_response = requests.get(f"{base_url}/health")
        print(f"Health check: {health_response.status_code} - {health_response.json()}")
        
        # 2. Clear test users
        print("2. Clearing test users...")
        clear_response = requests.post(f"{base_url}/clear-test-users")
        print(f"Clear users: {clear_response.status_code} - {clear_response.json()}")
        
        # 3. Test registration with a fresh phone number
        print("3. Testing registration...")
        test_data = {
            "phone": "9876543210",
            "name": "Test User",
            "pin": "1234",
            "role": "patient"
        }
        
        response = requests.post(
            f"{base_url}/register",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration response: {response.status_code}")
        print(f"Response data: {response.json()}")
        
        if response.status_code == 200:
            print("✓ Registration successful!")
            
            # 4. Test login with the same credentials
            print("4. Testing login...")
            login_response = requests.post(
                f"{base_url}/login",
                json={"phone": "9876543210", "pin": "1234"},
                headers={"Content-Type": "application/json"}
            )
            print(f"Login response: {login_response.status_code} - {login_response.json()}")
            
        else:
            print(f"✗ Registration failed: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend server. Make sure it's running on http://localhost:5000")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    fix_and_test_registration()
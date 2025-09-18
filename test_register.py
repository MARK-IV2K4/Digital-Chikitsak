#!/usr/bin/env python3

import requests
import json

def test_registration():
    print("Testing registration endpoint...")
    
    # Test data
    test_data = {
        "phone": "9876543210",
        "name": "Test User",
        "pin": "1234",
        "role": "patient"
    }
    
    try:
        # Test health endpoint first
        print("1. Testing health endpoint...")
        health_response = requests.get("http://localhost:5000/api/health")
        print(f"Health check: {health_response.status_code} - {health_response.json()}")
        
        # Test registration
        print("2. Testing registration endpoint...")
        response = requests.post(
            "http://localhost:5000/api/register",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration response: {response.status_code}")
        print(f"Response data: {response.json()}")
        
        if response.status_code == 200:
            print("✓ Registration successful!")
        else:
            print(f"✗ Registration failed: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend server. Make sure it's running on http://localhost:5000")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    test_registration()
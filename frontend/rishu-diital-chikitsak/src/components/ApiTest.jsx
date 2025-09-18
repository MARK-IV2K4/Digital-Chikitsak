import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    try {
      let response;
      if (method === 'GET') {
        response = await api.get(endpoint);
      } else if (method === 'POST') {
        response = await api.post(endpoint, data);
      }
      
      setTestResults(prev => ({
        ...prev,
        [endpoint]: { success: true, data: response.data, status: response.status }
      }));
      
      toast.success(`${endpoint} - Success!`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: { 
          success: false, 
          error: error.response?.data || error.message,
          status: error.response?.status 
        }
      }));
      
      toast.error(`${endpoint} - Failed!`);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    { name: 'Health Check', endpoint: '/health', method: 'GET' },
    { name: 'Test DB', endpoint: '/test-db', method: 'GET' },
    { name: 'Clear Test Users', endpoint: '/clear-test-users', method: 'POST' },
    { 
      name: 'Test Register Endpoint', 
      endpoint: '/test-register', 
      method: 'POST',
      data: {
        phone: '9876543210',
        name: 'Test User',
        pin: '1234',
        role: 'patient'
      }
    },
    { 
      name: 'Register Test User', 
      endpoint: '/register', 
      method: 'POST',
      data: {
        phone: '9876543210',
        name: 'Test User',
        pin: '1234',
        role: 'patient'
      }
    },
    { name: 'List Patients (Auth Required)', endpoint: '/patients', method: 'GET' },
    { 
      name: 'Add Test Patient', 
      endpoint: '/patients', 
      method: 'POST',
      data: {
        name: 'Test Patient',
        age: 25,
        gender: 'Male',
        relation: 'Test',
        phone: '1234567890'
      }
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {tests.map((test, index) => (
          <button
            key={index}
            onClick={() => testEndpoint(test.endpoint, test.method, test.data)}
            disabled={loading}
            className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {test.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Test Results:</h3>
        {Object.entries(testResults).map(([endpoint, result]) => (
          <div key={endpoint} className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="font-semibold">{endpoint} - Status: {result.status}</div>
            {result.success ? (
              <pre className="text-sm mt-2 overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
            ) : (
              <div className="text-red-600 mt-2">{JSON.stringify(result.error, null, 2)}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Current Auth Status:</h4>
        <div>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</div>
        <div>User: {localStorage.getItem('user') || 'Not logged in'}</div>
      </div>
    </div>
  );
};

export default ApiTest;
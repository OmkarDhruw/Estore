import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminFallback: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<{ 
    connected: boolean; 
    message: string;
    error?: string;
  }>({
    connected: false,
    message: 'Checking API connection...',
  });
  
  // Check API health on load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get<{ message: string; timestamp: string }>(
          'http://localhost:5000/api/health'
        );
        setApiStatus({
          connected: true,
          message: response.data.message,
        });
      } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        
        // Safe type check for any error object
        if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        }
        
        setApiStatus({
          connected: false,
          message: 'Failed to connect to API',
          error: errorMessage
        });
      }
    };
    
    checkApiHealth();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Panel Diagnosis</h1>
        
        <div className={`p-4 rounded-lg mb-6 ${apiStatus.connected ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="text-lg font-semibold">API Connection Status</h2>
          <div className="mt-2">
            <p><strong>Status:</strong> {apiStatus.connected ? 'Connected' : 'Disconnected'}</p>
            <p><strong>Message:</strong> {apiStatus.message}</p>
            {apiStatus.error && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                <p><strong>Error:</strong> {apiStatus.error}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Routes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><Link to="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link></li>
            <li><Link to="/admin/dashboard" className="text-blue-600 hover:underline">Admin Dashboard (explicit path)</Link></li>
            <li><Link to="/admin/hero-slider" className="text-blue-600 hover:underline">Hero Slider Management</Link></li>
            <li><Link to="/admin/explore-products" className="text-blue-600 hover:underline">Explore Products</Link></li>
            <li><Link to="/" className="text-blue-600 hover:underline">Back to Home</Link></li>
          </ul>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Ensure backend server is running on port 5000</li>
            <li>Check MongoDB connection in the server logs</li>
            <li>Verify CORS configuration on the backend</li>
            <li>Clear browser cache and reload the page</li>
            <li>Check browser console for JavaScript errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminFallback; 
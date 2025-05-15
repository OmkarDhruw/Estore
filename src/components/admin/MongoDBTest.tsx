import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MongoDBTest: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    message: string;
    data: any[];
    error?: string;
  }>({
    connected: false,
    message: 'Checking MongoDB connection...',
    data: []
  });

  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // Check hero sliders endpoint which uses MongoDB
        const response = await axios.get<{
          success: boolean;
          count: number;
          data: any[];
        }>('http://localhost:5000/api/hero-sliders');
        
        setDbStatus({
          connected: true,
          message: 'Successfully connected to MongoDB and fetched data',
          data: response.data.data || [],
        });
      } catch (error: any) {
        let errorMessage = 'Unknown error';
        if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = String(error.message);
        }
        
        setDbStatus({
          connected: false,
          message: 'Failed to connect to MongoDB',
          data: [],
          error: errorMessage
        });
      }
    };
    
    checkDbConnection();
  }, []);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg p-8 max-w-2xl w-full shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">MongoDB Connection Test</h1>
        
        <div className={`p-4 mb-6 rounded-lg ${dbStatus.connected ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="text-lg font-semibold">MongoDB Status</h2>
          <div className="mt-2">
            <p><strong>Status:</strong> {dbStatus.connected ? 'Connected' : 'Disconnected'}</p>
            <p><strong>Message:</strong> {dbStatus.message}</p>
            {dbStatus.error && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                <p><strong>Error:</strong> {dbStatus.error}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Hero Sliders Data</h2>
          {dbStatus.data.length === 0 ? (
            <p className="text-gray-600">No data available. The collection might be empty.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">Subtitle</th>
                    <th className="py-2 px-4 border-b">Button</th>
                    <th className="py-2 px-4 border-b">Media Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dbStatus.data.map((item: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border-b">{item.title}</td>
                      <td className="py-2 px-4 border-b">{item.subtitle}</td>
                      <td className="py-2 px-4 border-b">{item.buttonLabel}</td>
                      <td className="py-2 px-4 border-b">{item.mediaType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <a href="/admin-debug" className="text-blue-600 hover:underline">Go to Admin Debug Page</a>
          <span className="mx-2">•</span>
          <a href="/admin-test" className="text-blue-600 hover:underline">Go to Admin Test Page</a>
          <span className="mx-2">•</span>
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
        </div>
      </div>
    </div>
  );
};

export default MongoDBTest; 
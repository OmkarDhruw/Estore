import React from 'react';
import { Link } from 'react-router-dom';

const TestAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg p-8 max-w-md w-full shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Test Page</h1>
        
        <p className="mb-4 text-gray-700">
          If you can see this page, the admin routing is working correctly.
        </p>
        
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-semibold">Navigation Links</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><Link to="/admin" className="text-blue-600 hover:underline">Admin Dashboard</Link></li>
            <li><Link to="/admin/hero-slider" className="text-blue-600 hover:underline">Hero Slider Management</Link></li>
            <li><Link to="/admin/explore-products" className="text-blue-600 hover:underline">Explore Products</Link></li>
            <li><Link to="/admin-debug" className="text-blue-600 hover:underline">Admin Debug Page</Link></li>
            <li><Link to="/" className="text-blue-600 hover:underline">Home Page</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAdminPage; 
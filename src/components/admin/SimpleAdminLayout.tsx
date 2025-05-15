import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const SimpleAdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Simple sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <ul className="space-y-3">
          <li><Link to="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
          <li><Link to="/admin/hero-slider" className="block py-2 px-4 hover:bg-gray-700 rounded">Hero Slider</Link></li>
          <li><Link to="/admin/explore-products" className="block py-2 px-4 hover:bg-gray-700 rounded">Explore Products</Link></li>
          <li><Link to="/admin/category-products" className="block py-2 px-4 hover:bg-gray-700 rounded">Categories & Products</Link></li>
          <li><Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Back to Home</Link></li>
        </ul>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminLayout; 
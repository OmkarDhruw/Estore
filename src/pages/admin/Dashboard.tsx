import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Eye, 
  BarChart2 
} from 'lucide-react';
import axios from 'axios';

// Dashboard stats card interface
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: string;
    positive: boolean;
  };
}

// Dashboard stat card component
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className={`text-xs mt-2 ${change.positive ? 'text-green-500' : 'text-red-500'}`}>
            {change.positive ? '↑' : '↓'} {change.value} from last month
          </div>
        </div>
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Chart placeholder component
const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="bg-gray-100 h-60 rounded flex items-center justify-center">
        <BarChart2 size={40} className="text-gray-400" />
        <p className="ml-3 text-gray-500">Chart visualization will appear here</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // Add state for API health check
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; message: string; timestamp: string }>({
    connected: false,
    message: 'Checking API connection...',
    timestamp: ''
  });
  
  // Check API health on load
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get<{ message: string; timestamp: string }>('http://localhost:5000/api/health');
        setApiStatus({
          connected: true,
          message: response.data.message,
          timestamp: response.data.timestamp
        });
      } catch (error) {
        console.error('Failed to connect to API:', error);
        setApiStatus({
          connected: false,
          message: 'Failed to connect to API',
          timestamp: new Date().toISOString()
        });
      }
    };
    
    checkApiHealth();
  }, []);

  // Sample stats data
  const stats = [
    {
      title: 'Total Orders',
      value: '312',
      icon: <ShoppingBag size={24} />,
      change: { value: '12%', positive: true }
    },
    {
      title: 'Total Revenue',
      value: '$24,512',
      icon: <DollarSign size={24} />,
      change: { value: '8%', positive: true }
    },
    {
      title: 'Total Customers',
      value: '1,048',
      icon: <Users size={24} />,
      change: { value: '5%', positive: true }
    },
    {
      title: 'Total Views',
      value: '24,591',
      icon: <Eye size={24} />,
      change: { value: '3%', positive: false }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
            Generate Report
          </button>
        </div>
      </div>

      {/* API Status Section */}
      <div className={`p-4 rounded-lg ${apiStatus.connected ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 className="text-lg font-semibold">API Connection Status</h2>
        <div className="mt-2">
          <p><strong>Status:</strong> {apiStatus.connected ? 'Connected' : 'Disconnected'}</p>
          <p><strong>Message:</strong> {apiStatus.message}</p>
          <p><strong>Last Checked:</strong> {apiStatus.timestamp}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Sales Overview" />
        <ChartPlaceholder title="Popular Products" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">
            Recent activity will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  ShoppingBag, 
  Tag, 
  Users, 
  Settings,
  Video,
  Layers,
  LogOut
} from 'lucide-react';

// Type for navigation item
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  // Navigation items
  const navItems: NavItem[] = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/admin/hero-slider', 
      label: 'Hero Slider', 
      icon: <Image size={20} /> 
    },
    { 
      path: '/admin/explore-products', 
      label: 'Explore Products', 
      icon: <Layers size={20} /> 
    },
    { 
      path: '/admin/category-products', 
      label: 'Categories & Products', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      path: '/admin/trending-products', 
      label: 'Trending Products', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      path: '/admin/featured-collections', 
      label: 'Featured Collections', 
      icon: <Tag size={20} /> 
    },
    { 
      path: '/admin/video-gallery', 
      label: 'Video Gallery', 
      icon: <Video size={20} /> 
    },
    { 
      path: '/admin/all-products', 
      label: 'All Products', 
      icon: <ShoppingBag size={20} /> 
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-pink-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-pink-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-pink-200 mt-1">Admin User (Dev) (admin)</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-8 py-4 ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                      ? 'bg-pink-900'
                      : 'hover:bg-pink-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="p-8 mt-auto">
          <button className="flex w-full items-center text-pink-200 hover:text-white">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
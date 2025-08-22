import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const adminModules = [
    {
      name: 'Product Management',
      icon: '📦',
      description: 'Add, edit, and delete products in the store',
      link: '/admin/products',
      stats: { total: 24, recent: 3 }
    },
    {
      name: 'Coach Management',
      icon: '👨‍🏫',
      description: 'Manage Growth Architects profiles and availability',
      link: '/admin/coaches',
      stats: { total: 12, recent: 2 }
    },
    {
      name: 'Architect Applications',
      icon: '🏗️',
      description: 'Review and manage architect application requests',
      link: '/admin/architects',
      stats: { total: 0, recent: 0 }
    },
    {
      name: 'User Management',
      icon: '👥',
      description: 'View and manage platform users',
      link: '/admin/users',
      stats: { total: 156, recent: 8 }
    },
    {
      name: 'Analytics',
      icon: '📊',
      description: 'Platform metrics and insights',
      link: '/admin/analytics',
      stats: { total: 4, recent: 4 }
    },
    {
      name: 'Settings',
      icon: '⚙️',
      description: 'Platform configuration and preferences',
      link: '/admin/settings',
      stats: { total: 0, recent: 0 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to the WinGroX AI admin panel. Manage products, coaches, and platform settings from here.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { name: 'Total Users', value: '156', change: '+12%', icon: '👥' },
          { name: 'Products', value: '24', change: '+3', icon: '📦' },
          { name: 'Coaches', value: '12', change: '+2', icon: '👨‍🏫' },
          { name: 'Sales', value: '$3,240', change: '+8%', icon: '💰' }
        ].map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modules */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {adminModules.map((module) => (
            <li key={module.name}>
              <Link 
                to={module.link}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-md">
                        <span className="text-2xl">{module.icon}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-600">{module.name}</div>
                        <div className="text-sm text-gray-500">{module.description}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-900">
                        {module.stats.total} total
                      </div>
                      {module.stats.recent > 0 && (
                        <div className="text-xs text-green-600">
                          +{module.stats.recent} new
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button className="bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">📦</span> Add New Product
          </button>
          <button className="bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">👨‍🏫</span> Add New Coach
          </button>
          <button className="bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">📊</span> View Reports
          </button>
          <button className="bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">⚙️</span> System Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

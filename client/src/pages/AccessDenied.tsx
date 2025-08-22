import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg
            className="w-20 h-20 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You do not have permission to access administrative features.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">            <p className="mb-4 text-gray-700">
              The administrative features you're trying to access are restricted to administrators only. 
              You can still view and use the public parts of the site.
            </p>
            <div className="mt-6 flex flex-col space-y-4">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in with admin account
              </Link>
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to home page
              </Link>
            </div>
            <p className="mt-6 text-xs text-gray-500">
              If you believe you should have access to this page, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

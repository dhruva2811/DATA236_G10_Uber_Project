// AdminEditCaptain.jsx
import React from 'react';
import CaptainEditForm from './CaptainEditForm';
import { Link } from 'react-router-dom';

const AdminEditCaptain = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav className="flex flex-col space-y-2 text-blue-700">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin/billing" className="hover:underline">Billing</Link>
          <Link to="/admin/analytics" className="hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="font-semibold underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="hover:underline">Manage Customers</Link>
          <Link to="/admin/support" className="hover:underline">Support</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Captain</h2>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <i className="ri-user-line text-xl text-gray-600"></i>
          </div>
        </div>
        <CaptainEditForm />
      </main>
    </div>
  );
};

export default AdminEditCaptain;

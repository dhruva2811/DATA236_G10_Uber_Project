import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [revenueToday, setRevenueToday] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [newSignups, setNewSignups] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('admin-token')}`
      };

      try {
        // Fetch today's revenue
        const revRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admins/analytics/revenue-today`, { headers });
        setRevenueToday(revRes.data.totalRevenue || 0);

        // Fetch total rides
        const ridesRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/total`, { headers });
        setTotalRides(ridesRes.data.total || 0);

        // Fetch new signups today
        const signupsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/new-today`, { headers });
        setNewSignups(signupsRes.data.count || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-bold">Admin Menu</h2>
        <nav className="space-y-4">
          <Link to="/admin/billing" className="block text-blue-700 hover:underline">Billing Records</Link>
          <Link to="/admin/analytics" className="block text-blue-700 hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="block text-blue-700 hover:underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="block text-blue-700 hover:underline">Manage Customers</Link>
          <Link to="/admin/support" className="block text-blue-700 hover:underline">Support Tickets</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="admin avatar"
            className="h-10 w-10 rounded-full border"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Total Revenue Today</h3>
            <p className="text-2xl font-bold">${revenueToday.toFixed(2)}</p>
          </div>

          <div className="bg-white border rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Total Rides</h3>
            <p className="text-2xl font-bold">{totalRides}</p>
          </div>

          <div className="bg-white border rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">New Signups Today</h3>
            <p className="text-2xl font-bold">{newSignups}</p>
          </div>
        </div>

        {/* View Full Analytics Link */}
        <div className="text-right mt-4">
          <Link
            to="/admin/analytics"
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            → View Full Analytics
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

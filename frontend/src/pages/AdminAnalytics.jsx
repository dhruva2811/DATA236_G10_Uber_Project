// ✅ AdminAnalytics.jsx (With Sidebar + Topbar Layout)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [areaStats, setAreaStats] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admins/analytics/overview`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`
          }
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to load analytics:", err.message);
      }
    }

    async function fetchAreaStats() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/stats/area`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`
          }
        });
        setAreaStats(res.data);
      } catch (err) {
        alert('Failed to load area stats');
      }
    }

    fetchAnalytics();
    fetchAreaStats();
  }, []);

  const filterByDate = (data) => {
    if (!startDate && !endDate) return data;
    return data.filter(d => {
      const date = new Date(d._id);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return true;
    });
  };

  if (!analytics) return <div className="p-6 text-lg">Loading analytics...</div>;

  const filteredRevenue = filterByDate(analytics.revenuePerDay);
  const filteredRides = filterByDate(analytics.ridesPerDay);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4 shadow-sm">
        <h2 className="text-xl font-bold">Admin Menu</h2>
        <nav className="space-y-2 text-blue-700">
          <Link to="/admin/dashboard" className="block hover:underline">Dashboard</Link>
          <Link to="/admin/billing" className="block hover:underline">Billing Records</Link>
          <Link to="/admin/analytics" className="block hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="block hover:underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="block hover:underline">Manage Customers</Link>
          <Link to="/admin/support" className="block hover:underline">Support Tickets</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Admin Analytics</h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="admin avatar"
            className="h-10 w-10 rounded-full border"
          />
        </div>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mb-10">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue per Day ($)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#38bdf8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Rides per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredRides}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Rides per Area</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={areaStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;

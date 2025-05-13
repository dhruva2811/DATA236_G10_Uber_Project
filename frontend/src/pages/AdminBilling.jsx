import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

const AdminBilling = () => {
  const [billings, setBillings] = useState([]);
  const [filters, setFilters] = useState({
    date: null,
    customerId: '',
    driverId: '',
    minFare: ''
  });

  const fetchBillings = async () => {
    try {
      const params = {};
      if (filters.customerId) params.customerId = filters.customerId;
      if (filters.driverId) params.driverId = filters.driverId;
      if (filters.minFare) params.minFare = filters.minFare;
      if (filters.date) params.date = filters.date.toISOString().split('T')[0];

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/billing/search`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      setBillings(res.data);
    } catch (err) {
      alert('Failed to fetch billing data');
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this bill?');
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/billing/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`
        }
      });
      alert('Bill deleted');
      fetchBillings();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav className="flex flex-col space-y-2 text-blue-700">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin/billing" className="hover:underline font-semibold">Billing Records</Link>
          <Link to="/admin/analytics" className="hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="hover:underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="hover:underline">Manage Customers</Link>
          <Link to="/admin/support" className="hover:underline">Support Tickets</Link>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-6 space-y-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Billing Records</h2>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <i className="ri-user-line text-xl text-gray-600"></i>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={filters.customerId}
            onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Driver ID"
            value={filters.driverId}
            onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Min Fare"
            value={filters.minFare}
            onChange={(e) => setFilters({ ...filters, minFare: e.target.value })}
            className="border px-4 py-2 rounded"
          />
          <DatePicker
            selected={filters.date}
            onChange={(date) => setFilters({ ...filters, date })}
            placeholderText="Filter by date"
            className="border px-4 py-2 rounded w-full"
          />
        </div>

        <button
          onClick={fetchBillings}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Apply Filters
        </button>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Ride ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">Fare ($)</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Dropoff</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((bill) => (
                <tr key={bill._id} className="border-t">
                  <td className="px-4 py-2">{bill.rideId?._id}</td>
                  <td className="px-4 py-2">
                    {bill.customerId?.fullname?.firstname} {bill.customerId?.fullname?.lastname}
                  </td>
                  <td className="px-4 py-2">{bill.driverId?.fullname?.firstname}</td>
                  <td className="px-4 py-2">${bill.fareFinal?.toFixed(2)}</td>
                  <td className="px-4 py-2 capitalize">{bill.paymentMode}</td>
                  <td className="px-4 py-2">{bill.rideId?.pickup}</td>
                  <td className="px-4 py-2">{bill.rideId?.destination}</td>
                  <td className="px-4 py-2">{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {billings.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminBilling;

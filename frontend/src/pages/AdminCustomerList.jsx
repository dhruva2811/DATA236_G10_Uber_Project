import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users`)
      .then(res => setCustomers(res.data))
      .catch(() => alert("Failed to load customers"));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-bold">Admin Menu</h2>
        <nav className="space-y-4 text-blue-700">
          <Link to="/admin/dashboard" className="block hover:underline">Dashboard</Link>
          <Link to="/admin/billing" className="block hover:underline">Billing Records</Link>
          <Link to="/admin/analytics" className="block hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="block hover:underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="block font-semibold underline">Manage Customers</Link>
          <Link to="/admin/support" className="hover:underline">Support</Link>
        </nav>
      </aside>


      {/* Main Section */}
      <main className="flex-1 p-6">
        {/* Title + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Customers</h2>
          <button
            onClick={() => navigate('/admin/customers/add')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Customer
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="mb-4 border px-4 py-2 rounded w-full max-w-md"
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.filter(c =>
                `${c.fullname.firstname} ${c.fullname.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
              ).map(c => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2">{c.fullname.firstname} {c.fullname.lastname}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/customers/edit/${c._id}`)}
                      className="text-blue-600 hover:underline"
                    >Edit</button>
                    <button
                      onClick={() => navigate(`/admin/customers/rides/${c._id}`)}
                      className="text-green-600 hover:underline"
                    >View Rides</button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete this customer?")) {
                          await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/${c._id}`);
                          setCustomers(prev => prev.filter(u => u._id !== c._id));
                        }
                      }}
                      className="text-red-600 hover:underline"
                    >Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCustomerList;

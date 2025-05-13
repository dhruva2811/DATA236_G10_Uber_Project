import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminAddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: { firstname: '', lastname: '' },
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("fullname.")) {
      const key = name.split(".")[1];
      setForm(prev => ({ ...prev, fullname: { ...prev.fullname, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, form);
      alert("Customer added successfully");
      navigate('/admin/customers');
    } catch (err) {
      alert("Failed to add customer");
    }
  };

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
      

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
          {/* Name */}
          <input name="fullname.firstname" value={form.fullname.firstname} onChange={handleChange} className="border p-2 w-full" placeholder="First Name" required />
          <input name="fullname.lastname" value={form.fullname.lastname} onChange={handleChange} className="border p-2 w-full" placeholder="Last Name" required />

          {/* Contact Info */}
          <input name="email" type="email" value={form.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" placeholder="Phone (10 digits)" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} className="border p-2 w-full" placeholder="Password" required />

          {/* Address Info */}
          <input name="address" value={form.address} onChange={handleChange} className="border p-2 w-full" placeholder="Address" required />
          <input name="city" value={form.city} onChange={handleChange} className="border p-2 w-full" placeholder="City" required />
          <input name="state" value={form.state} onChange={handleChange} className="border p-2 w-full" placeholder="State (e.g., CA)" required />
          <input name="zipCode" value={form.zipCode} onChange={handleChange} className="border p-2 w-full" placeholder="Zip Code" required />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Create Customer
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminAddCustomer;

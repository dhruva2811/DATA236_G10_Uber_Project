import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AdminEditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: { firstname: '', lastname: '' },
    email: '',
    phone: ''
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/${id}`)
      .then(res => setForm(res.data))
      .catch(() => alert("Failed to load customer"));
  }, [id]);

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
      await axios.put(`${import.meta.env.VITE_BASE_URL}/users/${id}`, form);
      alert("Customer updated");
      navigate("/admin/customers");
    } catch {
      alert("Failed to update");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <nav className="flex flex-col space-y-2 text-blue-700">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/customers" className="font-semibold underline">Manage Customers</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
          <input name="fullname.firstname" value={form.fullname.firstname} onChange={handleChange} className="border p-2 w-full" placeholder="First Name" />
          <input name="fullname.lastname" value={form.fullname.lastname} onChange={handleChange} className="border p-2 w-full" placeholder="Last Name" />
          <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
          <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" placeholder="Phone" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        </form>
      </main>
    </div>
  );
};

export default AdminEditCustomer;

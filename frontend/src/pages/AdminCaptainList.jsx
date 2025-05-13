// ✅ Updated AdminCaptainList.jsx with Ratings and Review Count
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminCaptainList = () => {
  const [captains, setCaptains] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains`)
      .then(res => setCaptains(res.data))
      .catch(() => alert('Failed to load captains'));
  }, []);

  const filteredCaptains = captains.filter(c =>
    c.fullname.firstname.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicle?.vehicleType?.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this captain?")) return;

  try {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/captains/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin-token')}`
      }
    });
    alert("Captain deleted");

    // Remove deleted captain from state
    setCaptains(prev => prev.filter(c => c._id !== id));
  } catch (err) {
    console.error("❌ Delete failed:", err.response?.data || err.message);
    alert("Failed to delete captain");
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

      {/* Main Section */}
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Captains</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/captains/add')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Captain
            </button>
          </div>
        </div>

        <div className="max-w-md mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or vehicle type"
            className="border px-4 py-2 rounded w-full"
          />
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Vehicle</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Reviews</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCaptains.map(captain => (
                <tr key={captain._id} className="border-t">
                  <td className="px-4 py-2">{captain.fullname.firstname} {captain.fullname.lastname}</td>
                  <td className="px-4 py-2">{captain.email}</td>
                  <td className="px-4 py-2">{captain.phone}</td>
                  <td className="px-4 py-2">{captain.vehicle?.vehicleType}</td>
                  <td className="px-4 py-2">{captain.city}</td>
                  <td className="px-4 py-2">{captain.rating?.toFixed(1) || 'N/A'}</td>
                  <td className="px-4 py-2">{captain.reviews?.length || 0}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/captains/edit/${captain._id}`)}
                      className="text-blue-600 hover:underline"
                    >Edit</button>
                    <button
                      onClick={() => navigate(`/admin/captains/rides/${captain._id}`)}
                      className="text-green-600 hover:underline"
                    >View Rides</button>
                    <button
  onClick={() => handleDelete(captain._id)}
  className="text-red-600 hover:underline"
>
  Delete
</button>

                  </td>
                </tr>
              ))}
              {filteredCaptains.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">No matching captains found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCaptainList;
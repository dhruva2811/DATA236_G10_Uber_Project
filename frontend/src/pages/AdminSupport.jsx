import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/support`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin-token')}`
      }
    })
      .then(res => {
        console.log("✅ Loaded tickets:", res.data);
        setTickets(res.data);
      })
      .catch(err => {
        console.error("❌ Failed to load support tickets:", err.response?.data || err.message);
        alert("Failed to load support tickets");
      });
  }, []);

  const updateStatus = async (ticketId, newStatus) => {
    console.log("🔄 Updating status for ticket ID:", ticketId);
    try {
      const updated = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/support/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`
          }
        }
      );
      console.log("✅ Status updated:", updated.data);
      setTickets(prev =>
        prev.map(t => t._id === ticketId ? updated.data : t)
      );
    } catch (err) {
      console.error("❌ Failed to update ticket status:", err.response?.data || err.message);
      alert("Failed to update ticket status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav className="flex flex-col space-y-2 text-blue-700">
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'font-semibold underline' : 'hover:underline'}>Dashboard</Link>
          <Link to="/admin/billing" className={isActive('/admin/billing') ? 'font-semibold underline' : 'hover:underline'}>Billing</Link>
          <Link to="/admin/analytics" className={isActive('/admin/analytics') ? 'font-semibold underline' : 'hover:underline'}>Analytics</Link>
          <Link to="/admin/captains" className={isActive('/admin/captains') ? 'font-semibold underline' : 'hover:underline'}>Manage Drivers</Link>
          <Link to="/admin/customers" className={isActive('/admin/customers') ? 'font-semibold underline' : 'hover:underline'}>Manage Customers</Link>
          <Link to="/admin/support" className={isActive('/admin/support') ? 'font-semibold underline' : 'hover:underline'}>Support</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>

        <div className="bg-white border rounded shadow p-4">
          {tickets.length === 0 ? (
            <p>No tickets submitted.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => {
                console.log("🧾 Ticket ID:", ticket._id);
                return (
                  <li key={ticket._id} className="border p-4 rounded bg-gray-50">
                    <p><strong>User:</strong> {ticket.userId?.fullname?.firstname || 'Unknown'} {ticket.userId?.fullname?.lastname || ''}</p>
                    <p><strong>Category:</strong> {ticket.category}</p>
                    <p><strong>Message:</strong> {ticket.message}</p>
                    <p className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
                    <label className="block mt-2 text-sm font-medium">Status:</label>
                    <select
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket._id, e.target.value)}
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSupport;

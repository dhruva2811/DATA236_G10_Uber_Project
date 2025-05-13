import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import RideMediaGallery from '../components/RideMediaGallery';

const AdminCaptainRides = () => {
  const { id } = useParams(); // captainId
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/rides/by-captain/${id}`)
      .then(res => setRides(res.data))
      .catch(() => alert('Failed to load rides'));
  }, [id]);

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
        <h2 className="text-2xl font-bold mb-4">Rides for Captain ID: {id}</h2>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Destination</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Fare</th>
                <th className="px-4 py-2">Images</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <tr key={ride._id} className="border-t">
                  <td className="px-4 py-2">{ride.pickup}</td>
                  <td className="px-4 py-2">{ride.destination}</td>
                  <td className="px-4 py-2 capitalize">{ride.status}</td>
                  <td className="px-4 py-2">${ride.fare}</td>
                  <td className="px-4 py-2"><RideMediaGallery rideId={ride._id} /></td>
                </tr>
              ))}
              {rides.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No rides found for this captain.
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

export default AdminCaptainRides;

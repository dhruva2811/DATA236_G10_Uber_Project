import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import RideMediaGallery from '../components/RideMediaGallery';

const UserProfile = () => {
  const { user } = useContext(UserDataContext);
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Ride Cancelled');
  const [tickets, setTickets] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedRide, setSelectedRide] = useState('');

  useEffect(() => {
    if (!user?._id) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/rides/by-user/${user._id}`)
      .then(res => setRides(res.data))
      .catch(() => alert("Failed to fetch ride history"));

    axios.get(`${import.meta.env.VITE_BASE_URL}/support/user/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setTickets(res.data))
      .catch(() => alert("Failed to load support history"));
  }, [user]);

  const handleImageSubmit = async () => {
    if (!imageUrl || !selectedRide) return alert("Please fill both fields");
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/media/upload`, {
        rideId: selectedRide,
        imageUrl
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Image uploaded!");
      setImageUrl('');
      setSelectedRide('');
    } catch {
      alert("Failed to upload image.");
    }
  };

  const submitTicket = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/support`, { category, message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Support message submitted");
      setMessage('');
      setCategory('Ride Cancelled');

      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/support/user/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTickets(res.data);
    } catch (err) {
      alert("Failed to submit support message");
    }
  };

  if (!user || !user.fullname) return <div className="p-6 text-red-600">User not loaded. Try re-logging in.</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
        <p><strong>Name:</strong> {user.fullname.firstname} {user.fullname.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <Link to="/user/edit" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
          Edit Profile
        </Link>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">My Rides</h3>
        {rides.length === 0 ? <p>No rides yet</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rides.map((ride) => (
              <div key={ride._id} className="border rounded p-4 shadow">
                <p><strong>Pickup:</strong> {ride.pickup}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Status:</strong> {ride.status}</p>
                <p><strong>Fare:</strong> ${ride.fare}</p>
                <details className="mt-2">
                  <summary className="text-sm text-blue-600 cursor-pointer">View Uploaded Images</summary>
                  <RideMediaGallery rideId={ride._id} />
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Upload Ride Image</h3>
        <input
          type="text"
          placeholder="Paste image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
        <select
          value={selectedRide}
          onChange={(e) => setSelectedRide(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        >
          <option value="">Select Ride</option>
          {rides.map((r) => (
            <option key={r._id} value={r._id}>
              {r.pickup} → {r.destination}
            </option>
          ))}
        </select>
        <button
          onClick={handleImageSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Image URL
        </button>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Raise a Support Ticket</h3>
        <label className="block font-medium mb-1">Issue Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded p-2 mb-3">
          <option>Ride Cancelled</option>
          <option>Fare Dispute</option>
          <option>Driver Behavior</option>
          <option>Technical Issue</option>
          <option>Other</option>
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className="w-full border rounded p-2"
          placeholder="Describe your issue..."
        ></textarea>
        <button onClick={submitTicket} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Submit Ticket
        </button>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">My Support Tickets</h3>
        {tickets.length === 0 ? <p>No support tickets yet</p> : (
          <ul className="space-y-3">
            {tickets.map((t, i) => (
              <li key={i} className="border rounded p-3">
                <p><strong>Category:</strong> {t.category}</p>
                <p><strong>Message:</strong> {t.message}</p>
                <p className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
                <p className={`text-sm font-medium mt-1 ${t.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                  Status: {t.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

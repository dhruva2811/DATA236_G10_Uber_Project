import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RideRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  if (!ride || !ride.user) {
    return <div className="p-6 text-center text-red-500">Ride data not available</div>;
  }

  const confirmRide = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
        rideId: ride._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('captain-token')}` // ✅ fixed
        }
      });

      if (response.status === 200) {
        navigate('/captain/otp', { state: { ride } }); // ⏩ go to OTP page
      }
    } catch (err) {
      console.error('❌ Failed to confirm ride:', err.response?.data || err.message);
      alert('Failed to confirm ride. Please try again.');
    }
  };

  const ignoreRide = () => {
    navigate('/captain-home');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Incoming Ride Request</h2>

      <div className="border rounded p-4 bg-yellow-50 mb-4">
        <p><strong>Rider:</strong> {ride.user.fullname.firstname} {ride.user.fullname.lastname}</p>
        <p><strong>Pickup:</strong> {ride.pickup}</p>
        <p><strong>Destination:</strong> {ride.destination}</p>
        <p><strong>Fare:</strong> ${ride.fare}</p>
      </div>

      <div className="flex gap-4">
        <button onClick={confirmRide} className="bg-green-600 text-white px-4 py-2 rounded">Accept</button>
        <button onClick={ignoreRide} className="bg-gray-400 text-white px-4 py-2 rounded">Decline</button>
      </div>
    </div>
  );
};

export default RideRequestPage;

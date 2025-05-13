import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
  const [otp, setOtp] = useState('');

  if (!ride || !ride._id) {
    return <div className="p-6 text-center text-red-500">Ride data missing</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
        params: {
          rideId: ride._id,
          otp
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('captain-token')}`
        }
      });

      if (response.status === 200) {
        navigate('/captain-riding', { state: { ride: response.data } });
      }
    } catch (err) {
      console.error('❌ Failed to start ride:', err.response?.data || err.message);
      alert('OTP failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Enter OTP to Start Ride</h2>

      <div className="border rounded p-4 bg-blue-50 mb-4">
        <p><strong>Rider:</strong> {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}</p>
        <p><strong>Pickup:</strong> {ride.pickup}</p>
        <p><strong>Destination:</strong> {ride.destination}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          placeholder="Enter OTP"
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
          Start Ride
        </button>
      </form>
    </div>
  );
};

export default CaptainOtpPage;

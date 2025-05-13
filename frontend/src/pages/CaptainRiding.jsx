// ✅ Redesigned CaptainRiding.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import FinishRide from '../components/FinishRide';

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  if (!ride) {
    return (
      <div className="p-6 text-center text-red-500">
        Ride data missing.
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/captain-home')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      {/* Map */}
      <div className="h-full w-full z-0">
        <LiveTracking />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-white/80 shadow">
        <img className='h-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
        <Link to='/captain-home' className='h-10 w-10 bg-black text-white flex items-center justify-center rounded-full'>
          <i className="ri-home-line"></i>
        </Link>
      </div>

      {/* Bottom Slide-Up Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 z-50 rounded-t-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">On a Trip</h3>
            <p className="text-sm text-gray-500">Pickup: {ride.pickup}</p>
            <p className="text-sm text-gray-500">Destination: {ride.destination}</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">OTP</p>
            <p className="text-lg font-mono font-semibold bg-yellow-200 px-3 py-1 rounded">{ride.otp}</p>
          </div>
        </div>

        <div className="my-4 border-t border-gray-300"></div>

        <div className="flex justify-between items-center">
          <h4 className='text-lg font-medium'>Fare: ₹{ride.fare}</h4>
          <button
            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
            onClick={() => navigate('/captain-home')} // You can replace with FinishRide popup trigger
          >
            Complete Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;

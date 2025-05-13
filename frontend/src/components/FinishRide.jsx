import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinishRide = (props) => {
  const navigate = useNavigate();

  const endRide = async () => {
    const rideId = props.ride?._id;

    if (!rideId) {
      alert("Ride ID is missing. Cannot end the ride.");
      return;
    }

    console.log("🚦 Attempting to end ride:", rideId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
        rideId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('captain-token')}` // ✅ Use correct token key
        }
      });

      if (response.status === 200) {
        console.log("✅ Ride ended successfully");
        navigate('/captain-home');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("❌ Failed to end ride:", errMsg);
      alert("Failed to end ride: " + errMsg);
    }
  };

  if (!props.ride || !props.ride._id) {
    return (
      <div className="p-6 text-center text-red-500">
        Ride data is missing. Cannot complete ride.
      </div>
    );
  }

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.setFinishRidePanel(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>

      <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
        <div className='flex items-center gap-3'>
          <img className='h-12 rounded-full object-cover w-12'
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Rider" />
          <h2 className='text-lg font-medium'>{props.ride?.user?.fullname?.firstname}</h2>
        </div>
        <h5 className='text-lg font-semibold'>2.2 KM</h5>
      </div>

      <div className='w-full mt-5'>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className='text-lg font-medium'>Pickup</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className='text-lg font-medium'>Destination</h3>
            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 p-3'>
          <i className="ri-currency-line"></i>
          <div>
            <h3 className='text-lg font-medium'>${props.ride?.fare}</h3>
            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
          </div>
        </div>
      </div>

      <div className='mt-10 w-full'>
        <button
          onClick={endRide}
          className='w-full bg-green-600 text-white font-semibold p-3 rounded-lg'>
          Finish Ride
        </button>
      </div>
    </div>
  );
};

export default FinishRide;

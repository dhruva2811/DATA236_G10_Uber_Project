import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainHome = () => {
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && captain?._id) {
      socket.emit('join', {
        userId: captain._id,
        userType: 'captain',
      });

      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      };

      updateLocation();
      const interval = setInterval(updateLocation, 10000);
      return () => clearInterval(interval);
    }
  }, [socket, captain]);

  useEffect(() => {
    if (socket) {
      socket.on('new-ride', (data) => {
        console.log('🛬 Captain received ride:', data);
        navigate('/captain/ride-request', { state: { ride: data } });

    socket.on('user-payment-confirmed', (data) => {
        if (data.driverId === captain._id) {
        alert(`💰 Payment received for Ride: ${data.rideId}`);
        navigate('/captain-home');
 }
});

      });
    }
  }, [socket, navigate]);

  return (
    <div className='h-screen relative'>
      {/* Header */}
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="logo" />
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map Area */}
      <div className='h-3/5'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="map" />
      </div>

      {/* Info Panel */}
      <div className='h-2/5 p-6'>
        <CaptainDetails />

        <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
          <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="logo" />
          <div className="flex gap-4 items-center">
            <Link to="/captain/profile" className="bg-black text-white px-4 py-2 rounded">
              Profile
            </Link>
            <Link to="/captain-home" className="h-10 w-10 bg-white flex items-center justify-center rounded-full">
              <i className="text-lg font-medium ri-logout-box-r-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;

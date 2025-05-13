import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/start-bg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-6">
        {/* White Uber logo */}
        <img
          className='w-32 mb-6 brightness-0 invert'
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />

        <h1 className='text-white text-3xl font-bold mb-4'>Welcome to Uber Simulation</h1>
        <p className='text-white mb-8 text-center max-w-lg'>Choose your role below to get started</p>

        <div className='w-full max-w-md space-y-4'>
          {/* ✅ Teal button for user login */}
          <Link
            to='/login'
            className='block w-full bg-teal-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-teal-600 transition'
          >
            User Login
          </Link>

          <Link
            to='/captain-login'
            className='block w-full bg-green-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-green-700 transition'
          >
            Captain Login
          </Link>

          <Link
            to='/admin/login'
            className='block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition'
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;

import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CaptainProfile = () => {
  const { captain } = useContext(CaptainDataContext);
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!captain?._id) return;

    // Fetch rides by captain
    axios.get(`${import.meta.env.VITE_BASE_URL}/rides/by-captain/${captain._id}`)
      .then(res => setRides(res.data))
      .catch(() => alert('Failed to fetch rides'));

    // Fetch billing to calculate total earnings
    axios.get(`${import.meta.env.VITE_BASE_URL}/billing/by-driver/${captain._id}`)
      .then(res => {
        const total = res.data.reduce((sum, b) => sum + (b.fareFinal || 0), 0);
        setEarnings(total);
      })
      .catch(() => alert('Failed to fetch earnings'));
  }, [captain]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Captain Profile</h2>

      {/* Personal Info Section */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
        <p><strong>Name:</strong> {captain?.fullname?.firstname} {captain?.fullname?.lastname}</p>
        <p><strong>Email:</strong> {captain?.email}</p>
        <p><strong>Phone:</strong> {captain?.phone}</p>
        <p><strong>Vehicle:</strong> {captain?.vehicle?.vehicleType} - {captain?.vehicle?.plate} ({captain?.vehicle?.color})</p>

        <Link to={`/captain/edit/${captain?._id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
          Edit Profile
        </Link>
      </div>

      {/* Earnings Section */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Earnings</h3>
        <p className="text-2xl font-bold">${earnings.toFixed(2)}</p>
      </div>

      {/* Recent Rides */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Recent Rides</h3>
        {rides.length === 0 ? <p>No rides yet</p> : (
          <ul className="space-y-2">
            {rides.slice(0, 5).map(ride => (
              <li key={ride._id} className="border p-2 rounded">
                <p><strong>Pickup:</strong> {ride.pickup}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Status:</strong> {ride.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reviews & Ratings */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Reviews & Ratings</h3>
        {captain?.reviews?.length === 0 ? <p>No reviews yet</p> : (
          <ul className="space-y-2">
            {captain?.reviews.map((r, idx) => (
              <li key={idx} className="border p-2 rounded">
                <p><strong>Rating:</strong> {r.rating} / 5</p>
                <p>{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Intro Video */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Intro Video</h3>
        {captain?.media?.length === 0 ? <p>No video uploaded</p> : (
          <iframe
            width="100%"
            height="315"
            src={captain?.media[0]}
            title="Intro Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Upload Intro Video Link */}
      <Link to={`/captain/video/${captain?._id}`} className="ml-4 inline-block bg-purple-600 text-white px-4 py-2 rounded">
        Upload Intro Video
      </Link>
    </div>
  );
};

export default CaptainProfile;

import React, { useState } from 'react';
import axios from 'axios';

const RideImageUploader = ({ rideId }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleImageSubmit = async () => {
    if (!imageUrl) {
      setMessage("Please enter a valid image URL.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/media/upload`,
        { rideId, imageUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('Image uploaded successfully!');
    } catch (error) {
      setMessage('Failed to upload image.');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Upload Ride Image (URL)</h3>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-3 rounded-lg border bg-gray-50"
        placeholder="Paste image URL here"
      />
      <button
        onClick={handleImageSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-4"
      >
        Submit Image URL
      </button>
      {message && <p className="mt-3 text-center text-sm">{message}</p>}
    </div>
  );
};

export default RideImageUploader;

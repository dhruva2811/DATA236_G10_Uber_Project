import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RideMediaGallery = ({ rideId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/media/ride/${rideId}`)
      .then(res => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load ride images");
        setLoading(false);
      });
  }, [rideId]);

  if (loading) return <p className="text-gray-500 text-sm">Loading images...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
      {images.length === 0 ? (
        <p className="text-gray-500 text-sm col-span-full">No images uploaded.</p>
      ) : (
        images.map(img => (
          <div key={img._id} className="rounded overflow-hidden border">
            <img src={img.imageUrl} alt="Ride" className="w-full h-auto object-cover" />
          </div>
        ))
      )}
    </div>
  );
};

export default RideMediaGallery;

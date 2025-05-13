import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const IntroVideoUploader = () => {
  const { id } = useParams(); // ✅ grab :id from route
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');

  const uploadVideo = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/${id}/video`, { videoUrl });
      alert("Video uploaded");
      navigate('/captain/profile'); // ✅ redirect after upload
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6">
      <input
        type="url"
        placeholder="Paste YouTube or video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <button onClick={uploadVideo} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
    </div>
  );
};

export default IntroVideoUploader;

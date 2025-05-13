import React, { useState } from 'react';
import axios from 'axios';

const CaptainSearchForm = () => {
  const [filters, setFilters] = useState({ firstname: '', city: '', vehicleType: '' });
  const [results, setResults] = useState([]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/search`, { params: filters });
    setResults(res.data);
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <input name="firstname" onChange={handleChange} placeholder="First Name" className="border p-2 w-full" />
        <input name="city" onChange={handleChange} placeholder="City" className="border p-2 w-full" />
        <select name="vehicleType" onChange={handleChange} className="border p-2 w-full">
          <option value="">Select Vehicle Type</option>
          <option value="UberX">UberX</option>
          <option value="UberXX">UberXX</option>
          <option value="UberXXL">UberXXL</option>
        </select>
        <button onClick={handleSearch} className="bg-black text-white py-2 px-4 rounded">Search</button>
      </div>

      <div className="mt-6">
        {results.map((c) => (
          <div key={c._id} className="border p-4 mb-2 rounded">
            {c.fullname.firstname} {c.fullname.lastname} – {c.city}, {c.vehicle.vehicleType}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptainSearchForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CaptainEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    fullname: { firstname: '', lastname: '' },
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    vehicle: {
      color: '',
      plate: '',
      capacity: '',
      vehicleType: ''
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/${id}`)
      .then(res => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to fetch captain details");
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes("vehicle.")) {
      const key = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        vehicle: { ...prev.vehicle, [key]: value }
      }));
    } else if (name.includes("fullname.")) {
      const key = name.split(".")[1];
      setForm(prev => ({
        ...prev,
        fullname: { ...prev.fullname, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/captains/${id}`, form);
      alert("Captain updated successfully!");
      const isAdmin = location.pathname.includes("/admin/captains/edit");
      navigate(isAdmin ? "/admin/captains" : "/captain/profile");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading captain data...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white shadow rounded">
      <input name="fullname.firstname" value={form.fullname.firstname} onChange={handleChange} className="border p-2 w-full" placeholder="First Name" />
      <input name="fullname.lastname" value={form.fullname.lastname} onChange={handleChange} className="border p-2 w-full" placeholder="Last Name" />
      <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
      <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 w-full" placeholder="Phone" />
      <input name="address" value={form.address} onChange={handleChange} className="border p-2 w-full" placeholder="Address" />
      <input name="city" value={form.city} onChange={handleChange} className="border p-2 w-full" placeholder="City" />
      <input name="state" value={form.state} onChange={handleChange} className="border p-2 w-full" placeholder="State" />
      <input name="zipCode" value={form.zipCode} onChange={handleChange} className="border p-2 w-full" placeholder="Zip Code" />
      <input name="vehicle.color" value={form.vehicle.color} onChange={handleChange} className="border p-2 w-full" placeholder="Vehicle Color" />
      <input name="vehicle.plate" value={form.vehicle.plate} onChange={handleChange} className="border p-2 w-full" placeholder="Plate Number" />
      <input name="vehicle.capacity" value={form.vehicle.capacity} onChange={handleChange} className="border p-2 w-full" placeholder="Capacity" />
      <select name="vehicle.vehicleType" value={form.vehicle.vehicleType} onChange={handleChange} className="border p-2 w-full">
        <option value="">Select Vehicle Type</option>
        <option value="UberX">UberX</option>
        <option value="UberXX">UberXX</option>
        <option value="UberXXL">UberXXL</option>
      </select>
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Update</button>
    </form>
  );
};

export default CaptainEditForm;

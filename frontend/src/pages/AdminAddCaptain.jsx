import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminAddCaptain = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    driverId: '',
    fullname: { firstname: '', lastname: '' },
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    vehicle: {
      vehicleType: '',
      color: '',
      plate: '',
      capacity: ''
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('fullname.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        fullname: { ...prev.fullname, [key]: value }
      }));
    } else if (name.includes('vehicle.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        vehicle: { ...prev.vehicle, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\d{3}-\d{2}-\d{4}$/.test(form.driverId)) newErrors.driverId = "Invalid SSN format";
    if (form.fullname.firstname.length < 3) newErrors.firstname = "First name must be at least 3 characters";
    if (form.fullname.lastname.length < 3) newErrors.lastname = "Last name must be at least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.zipCode) newErrors.zipCode = "Zip Code is required";
    if (!form.vehicle.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!form.vehicle.color) newErrors.vehicleColor = "Color is required";
    if (!form.vehicle.plate) newErrors.plate = "Plate number is required";
    if (!form.vehicle.capacity || isNaN(form.vehicle.capacity)) newErrors.capacity = "Capacity must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, form);
      alert('Captain added successfully!');
      navigate('/admin/captains');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add captain');
    }
  };

  const inputClass = (field) =>
    `border px-4 py-2 rounded w-full ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  const errorText = (field) =>
    errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <nav className="flex flex-col space-y-2 text-blue-700">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin/billing" className="hover:underline">Billing</Link>
          <Link to="/admin/analytics" className="hover:underline">Analytics</Link>
          <Link to="/admin/captains" className="font-semibold underline">Manage Drivers</Link>
          <Link to="/admin/customers" className="hover:underline">Manage Customers</Link>
          <Link to="/admin/support" className="hover:underline">Support</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Captain</h2>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <i className="ri-user-line text-xl text-gray-600"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input name="driverId" value={form.driverId} onChange={handleChange} placeholder="Driver ID (SSN)" className={inputClass('driverId')} />
              {errorText('driverId')}
            </div>
            <div>
              <input name="fullname.firstname" value={form.fullname.firstname} onChange={handleChange} placeholder="First Name" className={inputClass('firstname')} />
              {errorText('firstname')}
            </div>
            <div>
              <input name="fullname.lastname" value={form.fullname.lastname} onChange={handleChange} placeholder="Last Name" className={inputClass('lastname')} />
              {errorText('lastname')}
            </div>
            <div>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass('email')} />
              {errorText('email')}
            </div>
            <div>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className={inputClass('password')} />
              {errorText('password')}
            </div>
            <div>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={inputClass('phone')} />
              {errorText('phone')}
            </div>
          </div>

          {/* Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className={inputClass('address')} />
              {errorText('address')}
            </div>
            <div>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputClass('city')} />
              {errorText('city')}
            </div>
            <div>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputClass('state')} />
              {errorText('state')}
            </div>
            <div>
              <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" className={inputClass('zipCode')} />
              {errorText('zipCode')}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <h3 className="text-lg font-semibold col-span-full">Vehicle Details</h3>

            <div>
              <select name="vehicle.vehicleType" value={form.vehicle.vehicleType} onChange={handleChange} className={inputClass('vehicleType')}>
                <option value="">Select Vehicle Type</option>
                <option value="UberX">UberX</option>
                <option value="UberXX">UberXX</option>
                <option value="UberXXL">UberXXL</option>
              </select>
              {errorText('vehicleType')}
            </div>

            <div>
              <input name="vehicle.color" value={form.vehicle.color} onChange={handleChange} placeholder="Vehicle Color" className={inputClass('vehicleColor')} />
              {errorText('vehicleColor')}
            </div>

            <div>
              <input name="vehicle.plate" value={form.vehicle.plate} onChange={handleChange} placeholder="Plate Number" className={inputClass('plate')} />
              {errorText('plate')}
            </div>

            <div>
              <input type="number" name="vehicle.capacity" value={form.vehicle.capacity} onChange={handleChange} placeholder="Capacity" className={inputClass('capacity')} />
              {errorText('capacity')}
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Create Captain
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminAddCaptain;

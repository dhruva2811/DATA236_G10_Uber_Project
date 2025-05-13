// src/pages/UserEditForm.jsx
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserEditForm = () => {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: user?.fullname?.firstname || '',
    lastname: user?.fullname?.lastname || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        fullname: {
          firstname: form.firstname,
          lastname: form.lastname
        },
        email: form.email
      };

      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/${user._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser(res.data);
      alert('User updated!');
      navigate('/user/profile');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input name="firstname" value={form.firstname} onChange={handleChange} className="border p-2 w-full" placeholder="First Name" />
      <input name="lastname" value={form.lastname} onChange={handleChange} className="border p-2 w-full" placeholder="Last Name" />
      <input name="email" value={form.email} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
};

export default UserEditForm;

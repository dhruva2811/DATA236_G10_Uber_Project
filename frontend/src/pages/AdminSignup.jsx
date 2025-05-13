import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        adminId: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admins/register`, form);
            localStorage.setItem('token', res.data.token);
            navigate('/admin/billing');
        } catch (err) {
            alert('Signup failed: ' + err.response?.data?.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Admin Signup</h2>
            <form onSubmit={handleSubmit} className="grid gap-3">
                {Object.entries(form).map(([key, value]) => (
                    <input key={key} name={key} placeholder={key} value={value} onChange={handleChange}
                        className="border p-2 rounded" required />
                ))}
                <button type="submit" className="bg-blue-600 text-white py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default AdminSignup;

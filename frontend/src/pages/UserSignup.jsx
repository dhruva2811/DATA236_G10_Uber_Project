import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(error => {
          const field = error.param || error.path;
          fieldErrors[field] = error.msg;
        });
        setErrors(fieldErrors);
      } else {
        alert('Signup failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img className="w-16 mb-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg w-full font-medium mb-2">What's your name</h3>
          <div className="flex gap-4 mb-5">
            <div className="w-1/2">
              <input
                required
                className={`bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg ${errors.firstname ? 'border-red-500' : ''}`}
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
            </div>
            <div className="w-1/2">
              <input
                required
                className={`bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg ${errors.lastname ? 'border-red-500' : ''}`}
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
            </div>
          </div>

          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            type="email"
            className={`bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg ${errors.email ? 'border-red-500' : ''}`}
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            required
            type="password"
            className={`bg-[#eeeeee] mb-2 rounded-lg px-4 py-2 border w-full text-lg ${errors.password ? 'border-red-500' : ''}`}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg"
          >
            Create account
          </button>
        </form>

        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-600">Login here</Link></p>
      </div>

      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;

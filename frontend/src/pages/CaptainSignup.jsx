import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  // Personal info
  const [driverId, setDriverId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Address info
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Vehicle info
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const captainData = {
        driverId,
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email,
        password,
        phone,
        address,
        city,
        state,
        zipCode,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType
        }
      };

      console.log("Sending:", captainData);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }

    } catch (err) {
      console.error("🚨 Signup failed:", err.response?.data);
      alert("Signup failed: " + JSON.stringify(err.response?.data?.errors || err.response?.data?.message));
    }

    // Reset form
    setDriverId('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
  };

  return (
    <div className='py-5 px-5 h-screen overflow-y-auto'>
      <form onSubmit={submitHandler}>
        <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

        <h3 className='text-lg font-medium mb-2'>Driver ID (SSN format)</h3>
        <input
          required
          className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg'
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          placeholder='123-45-6789'
        />

        <h3 className='text-lg font-medium mb-2'>Full Name</h3>
        <div className='flex gap-4 mb-4'>
          <input
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            type="text"
            placeholder='First name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            type="text"
            placeholder='Last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <h3 className='text-lg font-medium mb-2'>Contact Info</h3>
        <input
          required
          className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg'
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg'
          type="text"
          placeholder='Phone Number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          required
          className='bg-[#eeeeee] mb-4 rounded-lg px-4 py-2 border w-full text-lg'
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <h3 className='text-lg font-medium mb-2'>Address</h3>
        <input
          required
          className='bg-[#eeeeee] mb-3 rounded-lg px-4 py-2 border w-full text-lg'
          placeholder='Street Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className='flex gap-4 mb-4'>
          <input
            required
            className='w-1/3 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            required
            className='w-1/3 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            placeholder='State'
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            required
            className='w-1/3 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            placeholder='Zip Code'
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <h3 className='text-lg font-medium mb-2'>Vehicle Details</h3>
        <div className='flex gap-4 mb-4'>
          <input
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            placeholder='Vehicle Color'
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
          />
          <input
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            placeholder='Vehicle Plate'
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
          />
        </div>
        <div className='flex gap-4 mb-4'>
          <input
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            type="number"
            placeholder='Vehicle Capacity'
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
          />
          <select
            required
            className='w-1/2 bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg'
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="" disabled>Select Vehicle Type</option>
            <option value="UberX">UberX</option>
            <option value="UberXX">UberXX</option>
            <option value="UberXXL">UberXXL</option>
          </select>
        </div>

        <button
          type="submit"
          className='bg-[#111] text-white font-semibold rounded-lg px-4 py-2 w-full text-lg'
        >
          Create Captain Account
        </button>
      </form>

      <p className='text-center mt-4'>
        Already have an account? <Link to='/captain-login' className='text-blue-600'>Login here</Link>
      </p>
    </div>
  );
};

export default CaptainSignup;



// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CaptainDataContext } from '../context/CapatainContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const CaptainSignup = () => {

//   const navigate = useNavigate()

//   const [ email, setEmail ] = useState('')
//   const [ password, setPassword ] = useState('')
//   const [ firstName, setFirstName ] = useState('')
//   const [ lastName, setLastName ] = useState('')

//   const [ vehicleColor, setVehicleColor ] = useState('')
//   const [ vehiclePlate, setVehiclePlate ] = useState('')
//   const [ vehicleCapacity, setVehicleCapacity ] = useState('')
//   const [ vehicleType, setVehicleType ] = useState('')


//   const { captain, setCaptain } = React.useContext(CaptainDataContext)


//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const captainData = {
//       fullname: {
//         firstname: firstName,
//         lastname: lastName
//       },
//       email: email,
//       password: password,
//       vehicle: {
//         color: vehicleColor,
//         plate: vehiclePlate,
//         capacity: vehicleCapacity,
//         vehicleType: vehicleType
//       }
//     }

//     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

//     if (response.status === 201) {
//       const data = response.data
//       setCaptain(data.captain)
//       localStorage.setItem('token', data.token)
//       navigate('/captain-home')
//     }

//     setEmail('')
//     setFirstName('')
//     setLastName('')
//     setPassword('')
//     setVehicleColor('')
//     setVehiclePlate('')
//     setVehicleCapacity('')
//     setVehicleType('')

//   }
//   return (
//     <div className='py-5 px-5 h-screen flex flex-col justify-between'>
//       <div>
//         <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

//         <form onSubmit={(e) => {
//           submitHandler(e)
//         }}>

//           <h3 className='text-lg w-full  font-medium mb-2'>What's our Captain's name</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='First name'
//               value={firstName}
//               onChange={(e) => {
//                 setFirstName(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
//               type="text"
//               placeholder='Last name'
//               value={lastName}
//               onChange={(e) => {
//                 setLastName(e.target.value)
//               }}
//             />
//           </div>

//           <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
//           <input
//             required
//             value={email}
//             onChange={(e) => {
//               setEmail(e.target.value)
//             }}
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             type="email"
//             placeholder='email@example.com'
//           />

//           <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

//           <input
//             className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value)
//             }}
//             required type="password"
//             placeholder='password'
//           />

//           <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Color'
//               value={vehicleColor}
//               onChange={(e) => {
//                 setVehicleColor(e.target.value)
//               }}
//             />
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="text"
//               placeholder='Vehicle Plate'
//               value={vehiclePlate}
//               onChange={(e) => {
//                 setVehiclePlate(e.target.value)
//               }}
//             />
//           </div>
//           <div className='flex gap-4 mb-7'>
//             <input
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               type="number"
//               placeholder='Vehicle Capacity'
//               value={vehicleCapacity}
//               onChange={(e) => {
//                 setVehicleCapacity(e.target.value)
//               }}
//             />
//             <select
//               required
//               className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
//               value={vehicleType}
//               onChange={(e) => {
//                 setVehicleType(e.target.value)
//               }}
//             >
//               <option value="" disabled>Select Vehicle Type</option>
//               <option value="car">Car</option>
//               <option value="auto">Auto</option>
//               <option value="moto">Moto</option>
//             </select>
//           </div>

//           <button
//             className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
//           >Create Captain Account</button>

//         </form>
//         <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
//       </div>
//       <div>
//         <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
//           Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
//       </div>
//     </div>
//   )
// }

// export default CaptainSignup
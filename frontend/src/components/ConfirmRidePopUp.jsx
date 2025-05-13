import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const vehicleImages = {
        UberX: "https://cdn-icons-png.flaticon.com/128/18366/18366013.png",
        UberXX: "https://cdn-icons-png.flaticon.com/128/3772/3772837.png",
        UberXXL: "https://cdn-icons-png.flaticon.com/128/3097/3097220.png"
    };

    const selectedVehicleImage = vehicleImages[props.ride?.vehicleType];

    const submitHander = async (e) => {
        e.preventDefault();

        if (!props.ride?._id || !otp) {
            alert("Missing ride ID or OTP");
            return;
        }

        console.log("🔐 Submitting OTP:", otp, "for ride:", props.ride._id);

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                console.log("✅ Ride started successfully");
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                navigate('/captain-riding', { state: { ride: props.ride } });
            }
        } catch (err) {
            console.error("❌ Failed to start ride:", err.response?.data || err.message);
            alert("Failed to start ride: " + (err.response?.data?.message || err.message));
        }
    };

    // Safety guard: ride must exist
    if (!props.ride || !props.ride.user) {
        return (
            <div className="p-6 text-center text-red-500">
                Loading ride data or user info...
            </div>
        );
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false);
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>

            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src={selectedVehicleImage} alt={props.ride?.vehicleType} />
                    <h2 className='text-lg font-medium capitalize'>{props.ride.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>Vehicle: {props.ride?.vehicleType}</h5>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>${props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHander} className='mt-6 w-full'>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3'
                        placeholder='Enter OTP'
                    />
                    <button
                        type="submit"
                        disabled={!otp}
                        className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg disabled:opacity-50'
                    >
                        Confirm
                    </button>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(false);
                        props.setRidePopupPanel(false);
                        props.setVehiclePanel(true); 
                    }} className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;


// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'

// const ConfirmRidePopUp = (props) => {
//     const [ otp, setOtp ] = useState('')
//     const navigate = useNavigate()

//     const submitHander = async (e) => {
//         e.preventDefault()

//         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
//             params: {
//                 rideId: props.ride._id,
//                 otp: otp
//             },
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })

//         if (response.status === 200) {
//             props.setConfirmRidePopupPanel(false)
//             props.setRidePopupPanel(false)
//             navigate('/captain-riding', { state: { ride: props.ride } })
//         }


//     }
//     return (
//         <div>
//             <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
//                 props.setRidePopupPanel(false)
//             }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
//             <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>
//             <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
//                 <div className='flex items-center gap-3 '>
//                     <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
//                     <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
//                 </div>
//                 <h5 className='text-lg font-semibold'>2.2 KM</h5>
//             </div>
//             <div className='flex gap-2 justify-between flex-col items-center'>
//                 <div className='w-full mt-5'>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="ri-map-pin-user-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="text-lg ri-map-pin-2-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3'>
//                         <i className="ri-currency-line"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>${props.ride?.fare} </h3>
//                             <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className='mt-6 w-full'>
//                     <form onSubmit={submitHander}>
//                         <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3' placeholder='Enter OTP' />

//                         <button className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>Confirm</button>
//                         <button onClick={() => {
//                             props.setConfirmRidePopupPanel(false)
//                             props.setRidePopupPanel(false)

//                         }} className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'>Cancel</button>

//                     </form>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ConfirmRidePopUp
// ✅ ConfirmRide.jsx
import React, { useEffect, useState } from 'react';

const ConfirmRide = (props) => {
  const vehicleImages = {
    UberX: "https://cdn-icons-png.flaticon.com/128/18366/18366013.png",
    UberXX: "https://cdn-icons-png.flaticon.com/128/3772/3772837.png",
    UberXXL: "https://cdn-icons-png.flaticon.com/128/3097/3097220.png"
  };

  const vehicleCapacities = {
    UberX: 4,
    UberXX: 6,
    UberXXL: 8
  };

  const selectedVehicleImage = vehicleImages[props.vehicleType];
  const maxCapacity = vehicleCapacities[props.vehicleType];

  const [displayedFare, setDisplayedFare] = useState(0);

  useEffect(() => {
    const updatedFare = props.fare?.[props.vehicleType] || 0;
    setDisplayedFare(updatedFare);
  }, [props.fare, props.vehicleType]);

  return (
    <div>
      {/* 🔄 Change Vehicle Button */}
      <button
        onClick={() => {
          props.setConfirmRidePanel(false);
          props.setVehiclePanel(true);
        }}
        className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded mb-3"
      >
        🔄 Change Vehicle Type
      </button>

      <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <img className='h-20' src={selectedVehicleImage} alt={props.vehicleType} />

        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>${displayedFare}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Ride Fare</p>
            </div>
          </div>

          <div className='flex flex-col gap-2 px-3 mt-4'>
            <label className='text-sm font-medium text-gray-600'>Number of Passengers</label>
            <select
              value={props.passenger_count}
              onChange={(e) => props.setPassengerCount(parseInt(e.target.value))}
              className='w-full px-4 py-2 border rounded-lg bg-[#eee]'
            >
              {[...Array(maxCapacity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            props.setVehicleFound(true);
            props.setConfirmRidePanel(false);
            props.createRide();
          }}
          className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;


// import React from 'react'

// const ConfirmRide = (props) => {
//     return (
//         <div>
//             <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
//                 props.setConfirmRidePanel(false)
//             }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
//             <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

//             <div className='flex gap-2 justify-between flex-col items-center'>
//                 <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
//                 <div className='w-full mt-5'>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="ri-map-pin-user-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3 border-b-2'>
//                         <i className="text-lg ri-map-pin-2-fill"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>562/11-A</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
//                         </div>
//                     </div>
//                     <div className='flex items-center gap-5 p-3'>
//                         <i className="ri-currency-line"></i>
//                         <div>
//                             <h3 className='text-lg font-medium'>${props.fare[ props.vehicleType ]}</h3>
//                             <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
//                         </div>
//                     </div>
//                 </div>
//                 <button onClick={() => {
//                     props.setVehicleFound(true)
//                     props.setConfirmRidePanel(false)
//                     props.createRide()

//                 }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
//             </div>
//         </div>
//     )
// }

// export default ConfirmRide
// ✅ UserPaymentSummary.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';

const UserPaymentSummary = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [paymentMode, setPaymentMode] = useState('cash');
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    fetchOrCreateBilling();
  }, [rideId]);

  const fetchOrCreateBilling = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/billing/ride/${rideId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBilling(res.data);
      setPaymentMode(res.data.paymentMode || 'cash');
    } catch (err) {
      try {
        const newRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/billing`, { rideId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBilling(newRes.data);
        setPaymentMode(newRes.data.paymentMode || 'cash');
      } catch (e) {
        alert('Could not create bill');
      }
    }
  };

  const confirmPayment = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/billing/${billing._id}`, { paymentMode }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // ✅ Emit after billing is confirmed and exists
      socket.emit('user-payment-confirmed', {
        rideId: billing.rideId,
        customerId: billing.customerId,
        driverId: billing.driverId
      });

      alert('Payment Confirmed');
      navigate(`/user/receipt/${billing.rideId}`);
    } catch (err) {
      alert('Failed to update payment mode');
    }
  };

  if (!billing) return <div className='p-6'>Loading bill...</div>;

  return (
    <div className='p-6 max-w-2xl mx-auto bg-white shadow rounded'>
      <h2 className='text-2xl font-bold mb-4'>Billing Summary</h2>
      <div className='space-y-2'>
        <p><strong>Billing ID:</strong> {billing._id}</p>
        <p><strong>Date:</strong> {new Date(billing.createdAt).toLocaleString()}</p>
        <p><strong>Pickup Time:</strong> {new Date(billing.pickupTime).toLocaleString()}</p>
        <p><strong>Dropoff Time:</strong> {new Date(billing.dropoffTime).toLocaleString()}</p>
        <p><strong>Distance:</strong> {billing.distance} miles</p>
        <p><strong>Fare:</strong> ${billing.fareFinal}</p>
        <p><strong>Surge Multiplier:</strong> ×{billing.surgeMultiplier || 1}</p>
        <p><strong>Driver ID:</strong> {billing.driverId?.driverId}</p>
        <p><strong>Customer ID:</strong> {billing.customerId?._id}</p>
        <p><strong>Pickup:</strong> {billing.rideId?.pickup}</p>
        <p><strong>Destination:</strong> {billing.rideId?.destination}</p>

        <div>
          <label className='font-semibold'>Payment Mode:</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className='border p-2 rounded ml-2'
          >
            <option value='cash'>Cash</option>
            <option value='card'>Card</option>
          </select>
        </div>
      </div>

      <button
        onClick={confirmPayment}
        className='mt-6 bg-green-600 text-white px-4 py-2 rounded'
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default UserPaymentSummary;

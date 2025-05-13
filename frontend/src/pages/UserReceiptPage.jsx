// ✅ UserReceiptPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { UserDataContext } from '../context/UserContext';

const UserReceiptPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  const [billing, setBilling] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/billing/ride/${rideId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setBilling(res.data))
      .catch(() => alert("Failed to fetch billing receipt"));
  }, [rideId]);

  const submitReview = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/${billing.driverId._id}/review`, {
        rating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("✅ Review submitted!");
      setRating('');
      setComment('');
    } catch (err) {
      alert("❌ Failed to submit review");
    }
  };

  if (!billing) return <div className='p-6'>Loading receipt...</div>;

  return (
    <div className='p-6 max-w-xl mx-auto bg-white shadow rounded border'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Ride Receipt</h2>

      <div id="receipt-content" className='space-y-2'>
        <p><strong>Billing ID:</strong> {billing._id}</p>
        <p><strong>Date:</strong> {new Date(billing.createdAt).toLocaleString()}</p>
        <p><strong>Customer ID:</strong> {billing.customerId?._id}</p>
        <p><strong>Driver ID:</strong> {billing.driverId?.driverId}</p>
        <p><strong>Pickup:</strong> {billing.rideId?.pickup}</p>
        <p><strong>Destination:</strong> {billing.rideId?.destination}</p>
        <p><strong>Pickup Time:</strong> {new Date(billing.pickupTime).toLocaleString()}</p>
        <p><strong>Dropoff Time:</strong> {new Date(billing.dropoffTime).toLocaleString()}</p>
        <p><strong>Distance Covered:</strong> {billing.distance} miles</p>
        <p><strong>Surge Multiplier:</strong> ×{billing.surgeMultiplier}</p>
        <p><strong>Payment Mode:</strong> {billing.paymentMode}</p>
        <hr className='my-2' />
        <p className='text-xl'><strong>Total Fare:</strong> ${billing.fareFinal}</p>
      </div>

      <button
        onClick={() => {
          const element = document.getElementById('receipt-content');
          html2pdf().from(element).save(`Uber_Receipt_${rideId}.pdf`);
        }}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Receipt (PDF)
      </button>

      <div className="mt-8 p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold mb-2">Leave a Review for Your Captain</h3>
        <label className="block text-sm font-medium">Rating (1–5):</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label className="block text-sm font-medium">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          placeholder="Share your experience..."
          className="border p-2 rounded w-full mb-3"
        />

        <button
          onClick={submitReview}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!rating || !comment}
        >
          Submit Review
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Go to Home
      </button>

      <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
        <p><strong>Note:</strong> Payment has been submitted. Waiting for your driver to confirm ride completion.</p>
      </div>
    </div>
  );
};

export default UserReceiptPage;

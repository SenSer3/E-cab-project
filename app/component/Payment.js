'use client';

import { useState, useContext } from 'react';
import { RideContext } from '../context/RideContext';

export default function PaymentPage() {
  const { rideData } = useContext(RideContext);
  const [paid, setPaid] = useState(false);

  const { from, to, price } = rideData;

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      setPaid(true);
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Payment Summary</h1>

        {/* Ride Details */}
        <div className="mb-4">
          <p><strong>Pickup:</strong> {from}</p>
          <p><strong>Drop:</strong> {to}</p>
          <p><strong>Fare:</strong> {price || 'N/A'}</p>
        </div>

        {/* Payment Button */}
        {!paid ? (
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white w-full py-2 rounded-xl font-medium hover:bg-green-700 transition"
          >
            Pay Now
          </button>
        ) : (
          <div className="text-center text-green-700 font-semibold mt-4">
            ✅ Payment Successful!
          </div>
        )}
      </div>
    </main>
  );
}


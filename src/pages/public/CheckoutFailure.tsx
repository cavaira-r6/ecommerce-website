import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CheckoutFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-red-500/10 p-4 rounded-full inline-block">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-red-400">
          Payment Failed
        </h2>
        <p className="mt-2 text-gray-300">
          We couldn't process your payment. Please try again or choose a different payment method.
        </p>
        <div className="mt-4 space-y-4">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-md transition duration-300 transform hover:scale-[1.02]"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-gray-800 text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;

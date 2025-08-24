import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Verify payment with your backend
    const verifyPayment = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/payment/flouci/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payment_id: paymentId,
            order_id: orderId
          })
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        // Payment verified successfully
        // You might want to update order status here
      } catch (error) {
        console.error('Payment verification error:', error);
        navigate('/checkout/failure');
      }
    };

    if (paymentId && orderId) {
      verifyPayment();
    }
  }, [paymentId, orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-green-500/10 p-4 rounded-full inline-block">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Payment Successful!
        </h2>
        <p className="mt-2 text-gray-300">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <div className="mt-4 space-y-4">
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-md transition duration-300 transform hover:scale-[1.02]"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-800 text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

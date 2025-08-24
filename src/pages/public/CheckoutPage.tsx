import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { 
  Smartphone,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  Lock,
  Loader2
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  governorate: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { state: authState } = useAuth();
  
  const user = authState.user;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    governorate: ''
  });

  // Tunisia governorates
  const tunisianGovernorates = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Medenine', 'Tataouine'
  ];

  // Payment methods available in Tunisia
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'flouci',
      name: 'Flouci',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Pay securely with your Flouci account',
      available: true
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      icon: <MapPin className="h-6 w-6" />,
      description: 'Pay when you receive your order (Additional 5 TND fee)',
      available: true
    }
  ];

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/cart');
    }
  }, [state.items, navigate]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        customer_email: shippingInfo.email,
        total: selectedPaymentMethod === 'cash_on_delivery' 
          ? state.totalPrice + 5 // Add 5 TND for cash on delivery
          : state.totalPrice,
        payment_method: selectedPaymentMethod,
        items: state.items,
        shipping_info: shippingInfo
      };

      if (selectedPaymentMethod === 'flouci') {
        // Initialize Flouci payment with real API
        const paymentResponse = await fetch('http://localhost:3002/api/payment/flouci/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_FLOUCI_API_KEY}`
          },
          body: JSON.stringify({
            app_token: process.env.REACT_APP_FLOUCI_APP_TOKEN,
            app_secret: process.env.REACT_APP_FLOUCI_APP_SECRET,
            amount: state.totalPrice * 1000, // Convert to millimes
            accept_card: "true",
            session_timeout_secs: 1200,
            success_link: `${window.location.origin}/checkout/success`,
            fail_link: `${window.location.origin}/checkout/failure`,
            developer_tracking: process.env.REACT_APP_FLOUCI_DEVELOPER_ID,
            order_id: Date.now().toString(),
            client_email: shippingInfo.email,
            client_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            client_phone: shippingInfo.phone,
            address_billing: shippingInfo.address,
            city_billing: shippingInfo.city,
            zip_billing: shippingInfo.postalCode
          })
        });

        if (paymentResponse.ok) {
          const { result } = await paymentResponse.json();
          if (result && result.pay_token) {
            // Redirect to Flouci secure payment page
            window.location.href = `https://secure.flouci.com/pay/${result.pay_token}`;
            return;
          }
          throw new Error('Invalid payment token');
        }
      }

      // For cash on delivery or after successful Flouci payment
      const response = await fetch('http://localhost:3002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        setOrderId(result.orderId);
        setOrderComplete(true);
        clearCart();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="bg-green-500/10 p-4 rounded-full inline-block">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Order Confirmed!
            </h2>
            <p className="mt-2 text-gray-300">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            {orderId && (
              <p className="mt-2 text-blue-400">
                Order ID: {orderId}
              </p>
            )}
          </div>
          <div className="mt-5 space-y-4">
            <Button
              onClick={() => navigate('/shop')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === 1 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 1 ? 'border-blue-400 bg-blue-400/10' : 'border-gray-500 bg-gray-500/10'
              }`}>
                1
              </div>
              <span className="ml-2">Shipping</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep === 2 ? 'bg-blue-400' : 'bg-gray-500'}`} />
            <div className={`flex items-center ${currentStep === 2 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 2 ? 'border-blue-400 bg-blue-400/10' : 'border-gray-500 bg-gray-500/10'
              }`}>
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
          </div>
        </div>

        {currentStep === 1 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Shipping Information</h2>
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-1 text-blue-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-1 text-blue-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Governorate
                  </label>
                  <select
                    required
                    value={shippingInfo.governorate}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, governorate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  >
                    <option value="">Select a governorate</option>
                    {tunisianGovernorates.map((governorate) => (
                      <option key={governorate} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => navigate('/cart')}
                  className="bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                  className={`relative flex items-center p-4 rounded-xl border ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${
                    method.available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedPaymentMethod === method.id
                        ? 'bg-blue-400/20 text-blue-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-sm text-gray-400">{method.description}</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-400'
                        : 'border-gray-500'
                    } flex items-center justify-center`}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <div className="rounded-xl bg-gray-700/30 p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">{state.totalPrice.toFixed(2)} TND</span>
                  </div>
                  {selectedPaymentMethod === 'cash_on_delivery' && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Delivery Fee</span>
                      <span className="text-white">5.00 TND</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white">
                      {(selectedPaymentMethod === 'cash_on_delivery' 
                        ? state.totalPrice + 5 
                        : state.totalPrice
                      ).toFixed(2)} TND
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    onClick={(e) => {
                      if (e) e.preventDefault();
                      handlePaymentSubmit(new Event('submit') as unknown as React.FormEvent);
                    }}
                    disabled={!selectedPaymentMethod || isProcessing}
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white ${
                      !selectedPaymentMethod || isProcessing
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="inline h-5 w-5 mr-2" />
                        Pay {(selectedPaymentMethod === 'cash_on_delivery' 
                          ? state.totalPrice + 5 
                          : state.totalPrice
                        ).toFixed(2)} TND
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order summary for larger screens */}
        <div className="hidden lg:block fixed top-24 right-8 w-80">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{item.name}</h4>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity} × {item.price.toFixed(2)} TND
                    </p>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {(item.quantity * item.price).toFixed(2)} TND
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

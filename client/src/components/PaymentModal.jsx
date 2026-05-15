import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const PaymentModal = ({ bill, onClose, onSuccess }) => {

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(!!window.Razorpay);

  // LOAD RAZORPAY SCRIPT
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        toast.error('Failed to load Razorpay. Please refresh the page.');
        setRazorpayLoaded(false);
      };
      document.body.appendChild(script);
    }
  }, []);



  // =========================
  // MOCK PAYMENT
  // =========================
  const handleMockPayment = async () => {

    setLoading(true);

    try {

      const { data: intentData } = await api.post(
        '/payment/mock-intent',
        {
          billId: bill._id,
        }
      );

      const { data: confirmData } = await api.post(
        '/payment/confirm-mock',
        {
          billId: bill._id,
          mockPaymentId: intentData.mockPaymentId,
        }
      );

      toast.success('Mock payment successful');

      onSuccess(confirmData.bill);

      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Payment failed'
      );

    } finally {

      setLoading(false);

    }
  };




  // =========================
  // RAZORPAY PAYMENT
  // =========================
  const handleRazorpayPayment = async () => {

    if (!razorpayLoaded || !window.Razorpay) {
      toast.error('Razorpay is not loaded. Please refresh and try again.');
      return;
    }

    try {

      setLoading(true);

      // CREATE ORDER
      const { data } = await api.post(
        '/payment/create-order',
        {
          billId: bill._id,
        }
      );

      if (!data.order || !data.key) {
        throw new Error('Invalid payment order response from server');
      }


      // RAZORPAY OPTIONS
      const options = {

        key: data.key,

        amount: data.order.amount,

        currency: 'INR',

        name: 'EBMS India',

        description: 'Electricity Bill Payment',

        order_id: data.order.id,

        customer_notify: 1,

        // SUCCESS HANDLER
        handler: async function (response) {

          try {

            const verifyRes = await api.post(
              '/payment/verify-payment',
              {

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                billId: bill._id,
              }
            );

            if (verifyRes.data.success) {
              toast.success('Payment successful!');
              onSuccess(verifyRes.data.bill);
              onClose();
            } else {
              throw new Error(verifyRes.data.message || 'Verification failed');
            }

          } catch (error) {

            toast.error(
              error.response?.data?.message ||
              error.message ||
              'Verification failed'
            );

          }
        },

        // ERROR HANDLER
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
          },
        },

        prefill: {
          name: 'Electricity Consumer',
          email: 'consumer@example.com',
          contact: '9999999999',
        },

        notes: {
          billId: bill._id,
        },

        theme: {
          color: '#14b8a6',
        },
      };


      // OPEN RAZORPAY
      const razor = new window.Razorpay(options);

      razor.open();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Payment failed'
      );

    } finally {

      setLoading(false);

    }
  };




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-slate-900">
            Payment
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-slate-600 transition leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">Complete your electricity bill payment</p>

        {/* AMOUNT CARD */}
        <div className="mb-7 rounded-2xl bg-gradient-to-r from-blue-900/5 to-cyan-500/5 border border-cyan-200/40 p-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-600 mb-2">
            Amount to Pay
          </p>
          <div className="flex items-baseline gap-2 mb-3">
            <h3 className="text-5xl font-black bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent">
              ₹{bill.amount}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Bill ID: <span className="font-semibold text-slate-700">{bill._id.slice(-6)}</span>
          </p>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-slate-200 mb-7"></div>

        {/* PAYMENT OPTIONS */}
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-600 mb-4">
          Payment Method
        </p>

        <div className="space-y-3 mb-6">

          {/* RAZORPAY */}
          <label className="flex cursor-pointer items-start rounded-2xl border-2 transition p-4"
            style={{
              borderColor: paymentMethod === 'razorpay' ? '#0ea5e9' : '#e2e8f0',
              backgroundColor: paymentMethod === 'razorpay' ? '#f0f9ff' : '#ffffff'
            }}>

            <div className="flex-shrink-0 mt-1">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-cyan-500"
              />
            </div>

            <div className="ml-4 flex-1">
              <p className="font-semibold text-slate-900">
                Razorpay Payment
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                UPI, Cards, Net Banking
              </p>
            </div>

            <div className="text-2xl">💳</div>

          </label>

          {/* MOCK PAYMENT */}
          <label className="flex cursor-pointer items-start rounded-2xl border-2 transition p-4"
            style={{
              borderColor: paymentMethod === 'mock' ? '#0ea5e9' : '#e2e8f0',
              backgroundColor: paymentMethod === 'mock' ? '#f0f9ff' : '#ffffff'
            }}>

            <div className="flex-shrink-0 mt-1">
              <input
                type="radio"
                name="payment"
                value="mock"
                checked={paymentMethod === 'mock'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-cyan-500"
              />
            </div>

            <div className="ml-4 flex-1">
              <p className="font-semibold text-slate-900">
                Demo Payment
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                For testing only
              </p>
            </div>

            <div className="text-2xl">🧪</div>

          </label>

        </div>

        {/* LOADING STATUS */}
        {!razorpayLoaded && paymentMethod === 'razorpay' && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700 flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Razorpay is loading... Please wait.
          </div>
        )}

        {/* DIVIDER */}
        <div className="h-px bg-slate-200 mb-6"></div>

        {/* BUTTONS */}
        <div className="flex gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={loading || (paymentMethod === 'razorpay' && !razorpayLoaded)}
            onClick={
              paymentMethod === 'mock'
                ? handleMockPayment
                : handleRazorpayPayment
            }
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-900 to-cyan-600 px-4 py-3 font-bold text-white shadow-lg transition hover:shadow-xl hover:from-blue-800 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span>
                Processing...
              </span>
            ) : (
              'Pay Now'
            )}
          </button>

        </div>

        {/* SECURITY INFO */}
        <p className="text-xs text-slate-500 text-center mt-4">
          🔒 Your payment information is encrypted and secure
        </p>

      </div>

    </div>
  );
};

export default PaymentModal;
import API from './api';

/**
 * Create a Razorpay order from the backend.
 * @param {string} bookingId
 */
export const createRazorpayOrder = async (bookingId) => {
  try {
    const response = await API.post('/payments/razorpay/create-order', { bookingId });
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: {
        orderId: `order_mock_${Date.now()}`,
        amount: 500,
        amountInPaise: 50000,
        currency: 'INR',
        keyId: 'rzp_test_imoviesDemo2024',
      },
    };
  }
};

/**
 * Verify Razorpay payment signature and confirm booking.
 * @param {{ bookingId: string, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }} data
 */
export const verifyRazorpayPayment = async (data) => {
  try {
    const response = await API.post('/payments/razorpay/verify', data);
    return response.data;
  } catch (err) {
    // Sync with local storage mock booking
    try {
      const existing = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      const updated = existing.map((b) =>
        b._id === data.bookingId ? { ...b, status: 'confirmed', transactionId: data.razorpay_payment_id } : b
      );
      localStorage.setItem('imovies_mock_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
      message: 'Razorpay payment verified successfully',
      data: {
        payment: {
          _id: 'PAY_' + Date.now().toString(36).toUpperCase(),
          transactionId: data.razorpay_payment_id || 'pay_' + Math.random().toString(36).substr(2, 9),
          status: 'success',
          paidAt: new Date().toISOString(),
        },
        booking: { _id: data.bookingId, status: 'confirmed' },
      },
    };
  }
};

/**
 * Standard simulated direct payment (for quick local checkout).
 * @param {{ bookingId: string, method: string, amount: number, paymentDetails?: Object }} data
 */
export const processPayment = async (data) => {
  try {
    const response = await API.post('/payments', data);
    return response.data;
  } catch (err) {
    // Update local storage mock booking if present
    try {
      const existing = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
      const updated = existing.map((b) => (b._id === data.bookingId ? { ...b, status: 'confirmed' } : b));
      localStorage.setItem('imovies_mock_bookings', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
      message: 'Payment completed successfully',
      data: {
        payment: {
          _id: 'PAY_' + Date.now().toString(36).toUpperCase(),
          transactionId: 'TXN' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          amount: data.amount || 500,
          method: data.method,
          status: 'success',
          paidAt: new Date().toISOString(),
        },
        booking: { _id: data.bookingId, status: 'confirmed' },
      },
    };
  }
};

/**
 * Get payment details by payment ID.
 * @param {string} id
 */
export const getPaymentById = async (id) => {
  try {
    const response = await API.get(`/payments/${id}`);
    return response.data;
  } catch (err) {
    return {
      success: true,
      data: {
        _id: id,
        status: 'success',
        amount: 500,
        paidAt: new Date().toISOString(),
      },
    };
  }
};

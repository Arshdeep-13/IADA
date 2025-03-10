import React from 'react';

function PaymentFailure() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-gray-700 mb-8">
        Unfortunately, your payment was not successful. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => window.location.href = '/retry-payment'}
        className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Retry Payment
      </button>
    </div>
  );
}

export default PaymentFailure;

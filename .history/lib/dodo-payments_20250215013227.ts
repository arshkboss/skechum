'use client';

import DodoPayments from 'dodopayments';
import { CountryCode } from 'dodopayments/resources/misc/supported-countries';

// Initialize Dodo Payments client
const dodoClient = new DodoPayments({
  bearerToken: process.env['NEXT_PUBLIC_DODO_PAYMENTS_API_KEY'],
  environment: 'test_mode', // Use test mode for development
});

// Interface for payment details
interface PaymentDetails {
  amount: number;
  customerEmail: string;
  customerName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
}

// Create payment service
export const PaymentService = {
  // Create a payment
  createPayment: async (paymentDetails: PaymentDetails) => {
    try {
      const payment = await dodoClient.payments.create({
        billing: {
          street: paymentDetails.billingAddress.street,
          city: paymentDetails.billingAddress.city,
          state: paymentDetails.billingAddress.state,
          country: paymentDetails.billingAddress.country as CountryCode,
          zipcode: paymentDetails.billingAddress.zipcode,
        },
        customer: {
          customer_id: `CUST_${Date.now()}`, // Generate a unique customer ID
          email: paymentDetails.customerEmail,
          name: paymentDetails.customerName,
        },
        product_cart: [
          {
            product_id: 'TEST_PRODUCT',
            quantity: 1,
            amount: paymentDetails.amount,
          },
        ],
        payment_link: true, // Generate payment link
      });

      return payment;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  },
}; 
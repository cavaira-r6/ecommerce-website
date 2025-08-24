import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Initialize Flouci payment
router.post('/flouci/init', async (req, res) => {
  try {
    if (!process.env.FLOUCI_API_KEY || !process.env.FLOUCI_APP_TOKEN || !process.env.FLOUCI_APP_SECRET) {
      throw new Error('Missing Flouci credentials in environment variables');
    }

    const {
      amount,
      order_id,
      client_email,
      client_name,
      client_phone,
      address_billing,
      city_billing,
      zip_billing
    } = req.body;

    if (!amount || !order_id || !client_email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, order_id, client_email'
      });
    }

    const response = await fetch('https://developers.flouci.com/api/generate_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLOUCI_API_KEY}`
      },
      body: JSON.stringify({
        app_token: process.env.FLOUCI_APP_TOKEN,
        app_secret: process.env.FLOUCI_APP_SECRET,
        amount: amount,
        accept_card: "true",
        session_timeout_secs: 1200,
        success_link: `${req.protocol}://${req.get('host')}/checkout/success`,
        fail_link: `${req.protocol}://${req.get('host')}/checkout/failure`,
        developer_tracking: process.env.FLOUCI_DEVELOPER_ID,
        order_id: order_id,
        client_email: client_email,
        client_name: client_name,
        client_phone: client_phone,
        address_billing: address_billing,
        city_billing: city_billing,
        zip_billing: zip_billing
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initialize payment');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

// Verify Flouci payment
router.post('/flouci/verify', async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    const response = await fetch('https://developers.flouci.com/api/verify_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLOUCI_API_KEY}`
      },
      body: JSON.stringify({
        app_token: process.env.FLOUCI_APP_TOKEN,
        app_secret: process.env.FLOUCI_APP_SECRET,
        payment_id: payment_id
      })
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    
    // Update order status in your database
    // await db.updateOrderStatus(order_id, data.payment_status);
    
    res.json(data);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;

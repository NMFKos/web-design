const express = require('express');
const router = express.Router();

const PayOS = require("@payos/node");

const payos = new PayOS("681c2b60-b918-415e-ad15-17373d11e649", "b459ff64-84d0-41e3-b3d0-318c6342b569", "ae8c71191e25837ef79cfca6a2d52b5a47c5227578c20d7d50a59a14bb16ac39");

router.post('/create-payment-link', async (req, res) => {
    const order = {
        amount: 50000,
        description: 'Thanh toán tin đăng',
        orderCode: 10,
        returnUrl: 'http://localhost:8888/success.html',
        cancelUrl: 'http://localhost:8888/cancel.html',
    }
    const paymenLink = await payos.createPaymentLink(order);
    res.redirect(303, paymentLink.checkoutLink);
})

// https://d486-116-109-197-217.ngrok-free.app/receive-hook
router.post('/receive-hook', async (req, res) => {
    console.log(req.body);
    res.json;
});

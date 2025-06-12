const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');
const { client } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// ✅ Składanie nowego zamówienia
router.post('/', authMiddleware, async (req, res) => {
  const { products, totalPrice, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'Brak produktów w zamówieniu' });
  }

  try {
    const order = new Order({
      user: req.user.id,
      products,
      totalPrice,
      shippingAddress
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Błąd przy zapisie zamówienia:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Pobierz zamówienia zalogowanego użytkownika
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Pobierz wszystkie zamówienia (tylko admin)
router.get('/', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Symulacja płatności offline
router.post('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Zamówienie nie znalezione' });

    order.isPaid = true;
    order.paidAt = new Date();
    const updatedOrder = await order.save();

    res.json({ message: 'Zamówienie opłacone', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Tworzenie zamówienia PayPal
router.post('/:id/paypal/create', authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Zamówienie nie znalezione' });

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "PLN",
          value: order.totalPrice.toFixed(2)
        }
      }],
      application_context: {
        return_url: `http://localhost:5173/payment-success?orderId=${orderId}`,
        cancel_url: `http://localhost:5173/payment-cancelled`
      }
    });

    const response = await client().execute(request);
    res.json({ id: response.result.id, links: response.result.links });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Zatwierdzanie płatności PayPal
router.post('/:id/paypal/capture', authMiddleware, async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Zamówienie nie znalezione' });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res.json({ message: 'Zamówienie opłacone przez PayPal', capture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📩 Pobierz wszystkie wiadomości do danego zamówienia
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ order: req.params.id })
      .populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    console.error('❌ Błąd pobierania wiadomości:', err);
    res.status(500).json({ message: 'Błąd pobierania wiadomości' });
  }
});

// ✉️ Dodaj nową wiadomość do zamówienia
router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Treść wiadomości nie może być pusta' });
    }

    const message = new Message({
      order: req.params.id,
      sender: req.user.id,
      content
    });

    await message.save();
    const populated = await message.populate('sender', 'username');
    res.status(201).json(populated);
  } catch (err) {
    console.error('❌ Błąd wysyłania wiadomości:', err);
    res.status(400).json({ message: 'Błąd wysyłania wiadomości' });
  }
});

// ✅ Admin: zmiana statusu zamówienia
router.put('/:id/status', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Zamówienie nie znalezione' });

    order.status = status;
    await order.save();

    res.json({ message: 'Status zaktualizowany', order });
  } catch (err) {
    res.status(500).json({ message: 'Błąd aktualizacji statusu' });
  }
});


module.exports = router;

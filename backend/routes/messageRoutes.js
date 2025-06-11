const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const authMiddleware = require('../middleware/authMiddleware')
const isAdminMiddleware = require('../middleware/isAdminMiddleware')

// ✅ Pobierz wiadomości do danego zamówienia
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ order: req.params.orderId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 }) // najnowsze na górze
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: '❌ Błąd pobierania wiadomości' })
  }
})

// ✅ Dodaj nową wiadomość
router.post('/:orderId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body
    if (!content) {
  res.status(400)
  throw new Error('Treść wiadomości jest wymagana')
}
    const message = new Message({
      order: req.params.orderId,
      sender: req.user.id,
      content,
      readByAdmin: req.user.isAdmin,
      readByUser: req.user.isAdmin ? false : true
    })

    const saved = await message.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error('❌ Błąd zapisu wiadomości:', err)
    res.status(400).json({ message: err.message })
  }
})

// ✅ Policz wszystkie nieprzeczytane wiadomości dla admina
router.get('/admin/unread-count', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const count = await Message.countDocuments({ readByAdmin: false })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: '❌ Błąd zliczania wiadomości' })
  }
})

// ✅ Policz nieprzeczytane wiadomości pogrupowane po zamówieniu (dla admina)
router.get('/admin/unread-by-order', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const unread = await Message.aggregate([
      { $match: { readByAdmin: false } },
      { $group: { _id: '$order', count: { $sum: 1 } } }
    ])
    res.json(unread)
  } catch (err) {
    console.error('❌ Błąd w unread-by-order:', err)
    res.status(500).json({ message: 'Błąd serwera' })
  }
})

// ✅ Policz nieprzeczytane wiadomości per zamówienie
router.get('/admin/unread-per-order', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const unreadCounts = await Message.aggregate([
      { $match: { readByAdmin: false } },
      {
        $group: {
          _id: '$order',
          count: { $sum: 1 },
        },
      },
    ])
    res.json(unreadCounts)
  } catch (error) {
    res.status(500).json({ message: 'Błąd pobierania wiadomości' })
  }
})

module.exports = router

// ✅ Liczba nieprzeczytanych wiadomości dla użytkownika (wszystkich zamówień)
router.get('/user/unread-count', authMiddleware, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      sender: { $ne: req.user.id },       // wiadomość nie od użytkownika
      readByUser: false,                  // i nieprzeczytana
      user: req.user.id                   // (opcjonalnie, jeśli masz userId w wiadomości)
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Błąd zliczania wiadomości użytkownika' });
  }
});
// ✅ Oznacz wszystkie wiadomości z danego zamówienia jako przeczytane przez admina
router.put('/admin/mark-read/:orderId', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      { order: req.params.orderId, readByAdmin: false },
      { $set: { readByAdmin: true } }
    );
    res.json({ message: 'Wiadomości oznaczone jako przeczytane' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd oznaczania wiadomości jako przeczytane' });
  }
});

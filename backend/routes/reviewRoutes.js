const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const authMiddleware = require('../middleware/authMiddleware')

// ✅ Pobierz wszystkie opinie dla produktu
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: '❌ Błąd pobierania opinii' })
  }
})

// ✅ Dodaj opinię do produktu
router.post('/:productId', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body
  try {
    const existing = await Review.findOne({
      product: req.params.productId,
      user: req.user.id
    })

    if (existing) {
      return res.status(400).json({ message: 'Już dodałeś opinię do tego produktu' })
    }

    const review = new Review({
      product: req.params.productId,
      user: req.user.id,
      username: req.user.username,
      rating,
      comment
    })

    await review.save()
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: '❌ Błąd dodawania opinii' })
  }
})

module.exports = router

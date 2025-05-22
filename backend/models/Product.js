const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true }, // ⬅️ kategoria
  image: { type: String, required: true },
  pdf: { type: String } // ⬅️ instrukcja pielęgnacji (opcjonalna)
})

module.exports = mongoose.model('Product', productSchema)

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }, // ← NAZWA MUSI PASOWAĆ DO BACKENDU
  pdf: { type: String }
});

module.exports = mongoose.model('Product', productSchema);

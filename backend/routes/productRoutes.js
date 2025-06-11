const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const isAdminMiddleware = require('../middleware/isAdminMiddleware');

// 🔧 Konfiguracja multer z unikalną nazwą plików
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Pobieranie wszystkich produktów
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Pobieranie szczegółów jednego produktu
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produkt nie znaleziony' });
    res.json(product);
  } catch (err) {
    console.error('❌ Błąd pobierania produktu:', err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Dodawanie produktu (dla admina) z obrazkiem i opcjonalnie PDF
router.post(
  '/',
  authMiddleware,
  isAdminMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, price, description, category } = req.body;
      const image = req.files['image']?.[0];
      const pdf = req.files['pdf']?.[0];

      if (!image) return res.status(400).json({ message: 'Brak obrazka produktu' });

      const product = new Product({
        name,
        price,
        description,
        category,
        imageUrl: `http://localhost:5000/uploads/${image.filename}`,
        pdf: pdf ? `/uploads/${pdf.filename}` : null
      });

      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error('❌ Błąd zapisu produktu:', err);
      res.status(400).json({ message: err.message });
    }
  }
);

// ✅ Edycja produktu (dla admina)
router.put(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const image = req.files?.image?.[0];
      const pdf = req.files?.pdf?.[0];

      const updatedData = {
        name,
        price,
        description
      };

      if (image) updatedData.imageUrl = `http://localhost:5000/uploads/${image.filename}`;
      if (pdf) updatedData.pdf = `/uploads/${pdf.filename}`;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      if (!updatedProduct) return res.status(404).json({ message: 'Produkt nie znaleziony' });

      res.json(updatedProduct);
    } catch (err) {
      console.error('❌ Błąd edycji produktu:', err);
      res.status(400).json({ message: err.message });
    }
  }
);

// ✅ Usuwanie produktu (dla admina)
router.delete('/:id', authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Nie znaleziono produktu' });

    await product.deleteOne();
    res.json({ message: '✅ Produkt usunięty' });
  } catch (err) {
    res.status(500).json({ message: '❌ Błąd przy usuwaniu produktu' });
  }
});

module.exports = router;

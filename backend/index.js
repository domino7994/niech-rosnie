const express = require('express');
const morgan = require('morgan'); // ✅ logowanie requestów
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Modele i trasy
const Product = require('./models/Product');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Middleware do obsługi błędów
const errorHandler = require('./middleware/errorHandler');
// Komentarze
const reviewRoutes = require('./routes/reviewRoutes');


// Załaduj konfigurację z pliku .env
dotenv.config();

// Tworzenie aplikacji Express
const app = express();

// Middleware
app.use(express.json()); // Obsługa JSON
app.use(morgan('dev'));  // ✅ logowanie requestów
app.use(cors());          // Obsługa CORS

// Połączenie z bazą MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Połączono z bazą MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z bazą MongoDB:', err));

// Testowy endpoint
app.get('/', (req, res) => {
  res.send('🌱 API sklepu "Niech Rośnie" działa!');
});

// Trasy API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);

app.use('/api/reviews', reviewRoutes);


// Folder na pliki
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Obsługa błędów (na końcu!)
app.use(errorHandler);

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
});

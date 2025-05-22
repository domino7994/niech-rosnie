const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// 🔐 Logowanie
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
    }

    const token = generateToken(user);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (err) {
    console.error('❌ Błąd logowania:', err);
    res.status(500).json({ message: 'Błąd serwera podczas logowania' });
  }
};

// 📝 Rejestracja (opcjonalnie przeniesiemy też to)
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Użytkownik już istnieje' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
  } catch (err) {
    console.error('❌ Błąd rejestracji:', err);
    res.status(500).json({ message: 'Błąd serwera przy rejestracji' });
  }
};

const multer = require('multer');
const path = require('path');

// Konfiguracja miejsca zapisu i nazwy pliku
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs/');
  },
  filename: (req, file, cb) => {
    cb(null, `instrukcja-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filtrowanie tylko plików PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Tylko pliki PDF są dozwolone'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

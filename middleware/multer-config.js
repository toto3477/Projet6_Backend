const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webP': 'webp'
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

module.exports = upload;
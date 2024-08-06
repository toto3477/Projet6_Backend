const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const resizeAndConvertImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(' ').join('_').split('.')[0];
  const filename = name + Date.now() + '.webp';
  const outputPath = path.join('images', filename);

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('webp')
    .toFile(outputPath, (err, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      req.file.path = outputPath;
      next();
    });
};

module.exports = resizeAndConvertImage;
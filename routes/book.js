const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.post('/:id/rating', auth, bookCtrl.addRating);
router.post('/', auth, multer, bookCtrl.addBook);
router.get('/', bookCtrl.showBooks);
router.get('/bestrating', bookCtrl.showBestBook);
router.get('/:id', bookCtrl.showSingleBook);
router.put('/:id', auth, multer, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;

const router = require('express').Router();
const { getListings, createListing, updateListing, deleteListing } = require('../controllers/listingController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', auth, getListings);
router.post('/', auth, upload.array('images', 4), createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;

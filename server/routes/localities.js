const router = require('express').Router();
const { searchLocalities, getLocality } = require('../controllers/localityController');

router.get('/search', searchLocalities);
router.get('/:id', getLocality);

module.exports = router;

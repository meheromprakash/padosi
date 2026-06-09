const router = require('express').Router();
const { getBusinesses, createBusiness } = require('../controllers/businessController');
const auth = require('../middleware/auth');

router.get('/', auth, getBusinesses);
router.post('/', auth, createBusiness);

module.exports = router;

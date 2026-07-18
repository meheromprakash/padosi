const router = require('express').Router();
const { getFeed } = require('../controllers/feedController');
const auth = require('../middleware/auth');

router.get('/', auth, getFeed);

module.exports = router;

const router = require('express').Router();
const { getAlerts, createAlert } = require('../controllers/alertController');
const auth = require('../middleware/auth');

router.get('/', auth, getAlerts);
router.post('/', auth, createAlert);

module.exports = router;

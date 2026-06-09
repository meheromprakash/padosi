const router = require('express').Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;

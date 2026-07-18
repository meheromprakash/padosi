const router = require('express').Router();
const { getMessages, sendMessage, getConversations } = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/conversations', auth, getConversations);
router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;

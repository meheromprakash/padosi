const router = require('express').Router();
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const auth = require('../middleware/auth');

router.get('/', auth, getBookmarks);
router.post('/:postId', auth, addBookmark);
router.delete('/:postId', auth, removeBookmark);

module.exports = router;

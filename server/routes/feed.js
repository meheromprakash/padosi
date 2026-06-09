const router = require('express').Router();
const { getFeed, createPost, getPost, reactToPost, deletePost } = require('../controllers/feedController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', auth, getFeed);
router.post('/posts', auth, upload.array('media', 4), createPost);
router.get('/posts/:id', auth, getPost);
router.post('/posts/:id/react', auth, reactToPost);
router.delete('/posts/:id', auth, deletePost);

module.exports = router;

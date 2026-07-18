const router = require('express').Router();
const { createPost, getPost, reactToPost, deletePost, updatePost } = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const createUpload = require('../middleware/upload');

const upload = createUpload(10 * 1024 * 1024);

router.post('/', auth, upload.array('media', 4), createPost);
router.get('/:id', auth, getPost);
router.post('/:id/react', auth, reactToPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

// Comments
router.get('/:postId/comments', auth, commentController.getComments);
router.post('/:postId/comments', auth, commentController.createComment);
router.delete('/:postId/comments/:commentId', auth, commentController.deleteComment);

module.exports = router;

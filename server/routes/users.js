const router = require('express').Router();
const { getMe, updateMe } = require('../controllers/userController');
const auth = require('../middleware/auth');
const createUpload = require('../middleware/upload');

const upload = createUpload(5 * 1024 * 1024);

router.get('/me', auth, getMe);
router.put('/me', auth, upload.single('avatar'), updateMe);

module.exports = router;

const router = require('express').Router();
const { createReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.post('/', auth, createReport);

module.exports = router;

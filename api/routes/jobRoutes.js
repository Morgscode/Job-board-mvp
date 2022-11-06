const express = require('express');
const auth = require('../utils/auth');
const controller = require('../controllers/jobController');

const router = express.Router();

router.route('/')
.get(controller._index)

router.route('/:id')
.get(controller._find);

router.use(auth.protect);

router.route('/')
.post(controller._create);

router.route('/:id')
.put(controller._update)
.delete(controller._delete);
 
module.exports = router;
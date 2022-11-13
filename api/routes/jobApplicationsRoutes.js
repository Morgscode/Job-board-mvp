const express = require('express');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const controller = require('../controllers/jobApplicationController');

const router = express.Router();

router.use(catchAsync(auth.protect));

router.route('/')
.post(catchAsync(auth.jobBoardUser))
.post(controller._create);

router.use(catchAsync(auth.jobBoardRecruiter));

router.route('/')
.get(controller._index)

router.route('/:id')
.get(controller._find)
.put(controller._update)
.delete(controller._delete);

router.route('/jobs/:id')
.get(controller.findApplicationsByJobId);

module.exports = router;
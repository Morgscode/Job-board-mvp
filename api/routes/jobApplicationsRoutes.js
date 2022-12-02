const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const controller = require('../controllers/jobApplicationController');

const router = express.Router();
const upload = multer({dest: process.env.UPLOADS_DIR});

router.use(catchAsync(auth.protect));

router.route('/')
.post(catchAsync(auth.jobBoardUser))
.post(upload.single('cv'), controller._create);

router.use(catchAsync(auth.jobBoardRecruiter));

router.route('/')
.get(controller._index)

router.route('/:id')
.get(controller._find)
.put(controller._update)
.delete(controller._delete);

router.route('/jobs/:id')
.get(controller.findApplicationsByJobId);

router.route('/users/:id')
.get(controller.findApplicationsByUserId);

router.route('/job-application-status/:id')
.get(controller.findApplicationsByStatus);

module.exports = router;
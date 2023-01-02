const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const roles = require('../middleware/userRoles');
const auth = require('../middleware/authentication');
const controller = require('../controllers/meController');

const router = express.Router();

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.emailVerified));
router.use(catchAsync(roles.jobBoardUser));

router.route('/')
.get(controller._index);

router.route('/job-applications')
.get(controller.getJobApplications);

router.route('/uploads')
.get(controller.getFileUploads);

module.exports = router;
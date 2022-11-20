const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const controller = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({dest: process.env.UPLOADS_DIR});

router.use(catchAsync(auth.protect));

router.route('/:id')
.get(catchAsync(auth.jobBoardUser), controller._find);

router.route('/users/:id')
.get(catchAsync(auth.jobBoardUser), controller.findUploadsByUserId);

router.route('/')
.post(catchAsync(auth.jobBoardUser), upload.single('upload'), controller._create);

router.use(catchAsync(auth.jobBoardRecruiter));

router.route('/')
.get(controller._index)

router.route('/:id')
.put(controller._update) 
.delete(controller._delete);

router.route('/job-applications/:id')
.get(controller.findUploadByJobApplicationId);
 
module.exports = router;
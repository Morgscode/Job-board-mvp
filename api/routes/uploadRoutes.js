const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const auth = require('../utils/auth');
const controller = require('../controllers/uploadController');

const upload = multer({dest: process.env.UPLOADS_DIR});

const router = express.Router();

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.jobBoardUser));

router.route('/:id')
.get(controller._find);

router.route('/users/:id')
.get(controller.findUploadsByUserId);

router.route('/')
.post(upload.single('upload'), controller._create);

// router.use(catchAsync(auth.protect));
// router.use(catchAsync(auth.jobBoardRecruiter));

// router.route('/')
// .get(controller._index)

// router.route('/:id')
// .put(controller._update) 
// .delete(controller._delete);
 
module.exports = router;
const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const roles = require('../middleware/userRoles');
const auth = require('../middleware/authentication');
const controller = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({dest: process.env.UPLOADS_DIR});

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.emailVerified));

router.route('/:id')
.get(catchAsync(roles.jobBoardUser), controller._find);

router.route('/:id/download')
.get(catchAsync(roles.jobBoardRecruiter), controller.download);

router.route('/users/:id')
.get(catchAsync(roles.jobBoardUser), controller.findByUserId);

router.route('/')
.post(catchAsync(roles.jobBoardUser), upload.single('upload'), controller._create);

router.use(catchAsync(roles.jobBoardRecruiter));

router.route('/')
.get(controller._index);

router.route('/:id')
.put(controller._update) 
.delete(controller._delete);

router.route('/job-applications/:id')
.get(controller.findByJobApplicationId);
 
module.exports = router;
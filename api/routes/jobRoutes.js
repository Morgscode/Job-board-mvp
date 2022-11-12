const express = require('express');
const auth = require('../utils/auth');
const controller = require('../controllers/jobController');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

const router = express.Router();

router.route('/')
.get(controller._index);

router.route('/:id')
.get(controller._find);

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.jobBoardRecruiter));

router.route('/')
.post(controller._create);

router.route('/:id')
.put(controller._update)
.delete(controller._delete);

router.route('/job-categories/:jobCategoryId/locations/:locationId')
.get(controller.findJobsByCategoryAndLocation);

router.route('/job-categories/:id')
.get(controller.findJobsByCategory);

router.route('/locations/:id')
.get(controller.findJobsByLocation);
 
module.exports = router;
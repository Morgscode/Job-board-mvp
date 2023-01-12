const express = require('express');
const roles = require('../middleware/userRoles');
const auth = require('../middleware/authentication');
const controller = require('../controllers/jobController');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

const router = express.Router();

router.route('/').get(controller._index);

router.route('/:id').get(controller._find);

router.route('/post/:id').get(controller.getPost);

router.route('/salary-types/:id').get(controller.findBySalaryTypeId);

router
  .route('/employment-contract-types/:id')
  .get(controller.findByEmploymentContractTypeId);

router
  .route('/job-categories/:jobCategoryId/locations/:locationId')
  .get(controller.findByCategoryAndLocation);

router.route('/job-categories/:id').get(controller.findByCategory);

router.route('/locations/:id').get(controller.findByLocation);

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.emailVerified));
router.use(catchAsync(roles.jobBoardRecruiter));

router.route('/').post(controller._create);

router.route('/:id').put(controller._update).delete(controller._delete);

router.route('/job-applications/:id').get(controller.findByJobApplicationId);

module.exports = router;

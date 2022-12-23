const express = require('express');
const roles = require('../middleware/userRoles');
const auth = require('../middleware/authentication');
const controller = require('../controllers/employmentContractType');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

const router = express.Router();

router.route('/')
.get(controller._index);

router.route('/:id')
.get(controller._find);

router.route('/jobs/:id')
.get(controller.findByJobId);

router.use(catchAsync(auth.protect));
router.use(catchAsync(auth.emailVerified));
router.use(catchAsync(roles.jobBoardRecruiter));

router.route('/')
.post(controller._create);

router.route('/:id')
.put(controller._update)
.delete(controller._delete);
 
module.exports = router;
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/employmentContractTypeModel');
const { Job } = require('../models/jobModel');

const _index = catchAsync(async function (req, res, next) {
  const contractTypes = await model.EmploymentContractType.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!contractTypes) {
    return next(new NotFoundError('contract types not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { contractTypes },
  });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const contractType = await model.EmploymentContractType.findOne({
    where: { id },
  });

  if (!contractType) {
    return next(new NotFoundError('contract type not found'));
  }

  res.status(200).json({ status: 'success', data: { contractType } });
});

const _create = catchAsync(async function (req, res, next) {
  const { name } = req.body;
  const record = await model.EmploymentContractType.create({ name });

  if (!record) {
    return next(new AppError("couldn't create that contract type", 500, false));
  }

  res.status(201).json({ status: 'success', data: { contractType: record } });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { contractType } = req.body;

  if (!contractType) {
    return next(new AppError('missing contract type details', 400));
  }

  const record = await model.EmploymentContractType.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('location not found'));
  }

  const updated = await model._update(contractType, { id });
  if (!updated) {
    return next(
      new AppError('error - could not update salary type', 500, false)
    );
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.EmploymentContractType.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByJobId = catchAsync(async function(req, res, next) {
  const { id } = req.params;
  const job = await Job.findOne({where: {id, }});
  if (!job) {
    return next(new NotFoundError('job not found'));
  }

  const contractTypes = await job.getEmploymentContractType();
  if (!contractTypes) {
    return next(new AppError('there was a problem getting the contract types'));
  }

  res.status(200).json({
    status: "success",
    data: {
      contractTypes,
    }
  })
});

module.exports = { _index, _find, _create, _update, _delete, findByJobId };

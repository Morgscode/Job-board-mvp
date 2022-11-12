const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobModel');
const { Location } = require('../models/locationModel');
const { JobCategory } = require('../models/jobCategoryModel');
const { JobsInLocations } = require('../models/jobsInLocationsModel');
const { JobsInCategories } = require('../models/jobsInCategoriesModel');

const _index = catchAsync(async function (req, res, next) {
  const jobs = await model.Job.findAll();
  if (!jobs || jobs?.length === 0) {
    return next(new NotFoundError("we couldn't find any jobs"));
  }
  res
    .status(200)
    .json({ status: 'success', data: { jobs, jobCount: jobs.length } });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const job = await model.Job.findOne({ where: { id } });
  if (!job) {
    return next(new NotFoundError("we couldn't find that job"));
  }
  res.status(200).json({ status: 'success', data: { job } });
});

const _create = catchAsync(async function (req, res, next) {
  const job = ({ title, salary, salaryType, description, deadline } = req.body);
  const { locations = [], categories = [] } = req.body;
  if (locations?.length === 0 || categories?.length === 0) {
    return next(
      new AppError(
        'you need to create a job with at least one location and category',
        400
      )
    );
  }

  const record = await model.Job.create(job);
  if (!record) {
    return next(new AppError("we couldn't create that job", 500));
  }

  const inLocations = await Promise.all(
    locations.map(
      async (location) =>
        await JobsInLocations.create({
          JobId: record.id,
          LocationId: location,
        })
    )
  );

  const inCategories = await Promise.all(
    categories.map(
      async (category) =>
        await JobsInCategories.create({
          JobId: record.id,
          JobCategoryId: category,
        })
    )
  );

  res.status(201).json({
    status: 'success',
    data: { job: record, categories: inCategories, locations: inLocations },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { job } = req.body;
  const { locations = [], categories = [] } = req.body;
  if (!job) {
    return next(new AppError('you need to pass in some job details', 400));
  }
  const updated = await model._update(job, { id });
  if (!updated) {
    return next(new AppError("we couldn't update that job", 500));
  }

  const record = await model.Job.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError("we couldn't find that job"));
  }

  const inLocations = await Promise.all(
    locations.map(
      async (location) =>
        // TODO - add in check for junction model row
        await JobsInLocations.create({
          JobId: record.id,
          LocationId: location,
        })
    )
  );

  const inCategories = await Promise.all(
    categories.map(
      async (category) =>
         // TODO - add in check for junction model row
        await JobsInCategories.create({
          JobId: record.id,
          JobCategoryId: category,
        })
    )
  );

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("we couldn't delete that job", 400));
  }
  const deleted = await model.Job.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findJobsByLocation = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('you need to specify a category', 400));
  }
  const jobs = await Location.findAll({
    where: { id, },
    include: [{model: model.Job, as: 'LocationToJob'}]
  });
  if (!jobs || jobs?.length === 0) {
    return next(new NotFoundError("we couldn't find any jobs"));
  }
  res
    .status(200)
    .json({ status: 'success', data: { location:jobs, jobs: jobs[0].LocationToJob, jobCount: jobs[0].LocationToJob.length } });
});

const findJobsByCategory = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('you need to specify a category', 400));
  }
  const jobs = await JobCategory.findAll({ 
    where: { id, },
    include: [{model: model.Job, as: 'CategoryToJob'}]
  });
  if (!jobs || jobs?.length === 0) {
    return next(new NotFoundError("we couldn't find any jobs", 404));
  }
  res
    .status(200)
    .json({ status: 'success', data: { category: jobs, jobs: jobs[0].CategoryToJob, jobCount: jobs[0].CategoryToJob.length } });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findJobsByLocation,
  findJobsByCategory,
};

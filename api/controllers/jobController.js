const catchAsync = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const NotFoundError = require('../utils/NotFoundError');
const model = require('../models/jobModel');
const { Location } = require('../models/locationModel');
const { JobCategory } = require('../models/jobCategoryModel');
const { JobsInLocations } = require('../models/jobsInLocationsModel');
const { JobsInCategories } = require('../models/jobsInCategoriesModel');
const { SalaryType } = require('../models/salaryTypeModel');
const { EmploymentContractType } = require('../models/employmentContractTypeModel');

const _index = catchAsync(async function (req, res, next) {
  const jobs = await model.Job.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });

  if (!jobs || jobs?.length === 0) {
    return next(new NotFoundError('jobs not found'));
  }

  res.status(200).json({ status: 'success', data: { jobs } });
});

const _find = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const job = await model.Job.findOne({ where: { id } });

  if (!job) {
    return next(new NotFoundError('job not found'));
  }

  res.status(200).json({ status: 'success', data: { job } });
});

const _create = catchAsync(async function (req, res, next) {
  const job = ({ title, salary, description, deadline } = req.body);
  const { locations = [], categories = [], contractType, salaryType } = req.body;

  if (locations?.length === 0 || categories?.length === 0) {
    return next(new AppError('missing job location and/or category', 400));
  }

  if (!contractType || !salaryType) {
    return next(new AppError('missing job salary type and/or contract type', 400));
  }

  const record = await model.Job.create(job);
  if (!record) {
    return next(new AppError('error - unable to create job', 500, false));
  }

  const inLocations = await Promise.all(
    locations.map(async (location) => await record.addLocation(location))
  );

  const inCategories = await Promise.all(
    categories.map(async (category) => await record.addCategory(category))
  );

  const jobSalaryType = await record.setSalaryType(salaryType);

  const jobContractType = await record.setEmploymentContractType(contractType);

  res.status(201).json({
    status: 'success',
    data: {
      job: record,
      categories: inCategories,
      locations: inLocations,
      salaryType: jobSalaryType,
      contractType: jobContractType
    },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const { job } = req.body;
  const { locations = [], categories = [], salaryType, contractType } = req.body;

  if (!job) {
    return next(new AppError('missing job details', 400));
  }

  const record = await model.Job.findOne({ where: { id } });
  if (!record) {
    return next(new NotFoundError('job not found'));
  }

  const updated = await model._update(job, { id });
  if (!updated) {
    return next(new AppError('error - unable to update job', 500, false));
  }

  if (salaryType) {
    await record.setSalaryType(salaryType);
  }

  if (contractType) {
    await record.setEmploymentContractType(contractType);
  }

  const inLocations = await Promise.all(
    locations.map(async (location) => {
      const locationRecord = await JobsInLocations.findOne({
        where: { JobId: record.id, LocationId: location },
      });
      if (!locationRecord) {
        return await record.addLocation(location);
      }
    })
  );

  const inCategories = await Promise.all(
    categories.map(async (category) => {
      const catRecord = await JobsInCategories.findOne({
        where: { jobCategoryId: category, jobId: record.id },
      });
      if (!catRecord) {
        return await record.addCategory(category);
      }
    })
  );

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.Job.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findJobsByLocation = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const location = await Location.findOne({ where: { id } });
  if (!location) {
    return next(new NotFoundError("we coudln't find that location"));
  }

  const jobs = await location.getJobs();
  if (!jobs || Array.from(jobs)?.length === 0) {
    return next(
      new NotFoundError("we couldn't find any jobs at that location")
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      location,
      jobs,
      jobCount: jobs.length,
    },
  });
});

const findJobsByCategory = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const category = await JobCategory.findOne({ where: { id } });
  if (!category) {
    return next(new NotFoundError("we coudln't find that category"));
  }
  const jobs = await category.getJobs();
  if (!jobs || jobs?.length === 0) {
    return next(
      new NotFoundError("we couldn't find any jobs in that category")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      category,
      jobs,
    },
  });
});

const findJobsByCategoryAndLocation = catchAsync(async function (
  req,
  res,
  next
) {
  const { locationId, jobCategoryId } = req.params;
  if (!locationId || !jobCategoryId) {
    return next(
      new AppError('you need to specify a category and a location', 400)
    );
  }

  const location = await Location.findOne({ where: { id: locationId } });
  if (!location) {
    return next(new NotFoundError("we couldn't find that location"));
  }

  const category = await JobCategory.findOne({ where: { id: jobCategoryId } });
  if (!category) {
    return next(new NotFoundError("we couldn't find that category"));
  }

  const jobs = await model.Job.findAll({
    include: [
      {
        model: JobCategory,
        as: 'Category',
        attributes: [],
        where: { id: jobCategoryId },
      },
      { model: Location, attributes: [], where: { id: locationId } },
    ],
  });

  if (!jobs || Array.from(jobs).length === 0) {
    return next(new NotFoundError("we couldn't find any jobs", 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
      location,
      jobs,
    },
  });
});

const findBySalaryTypeId = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const salaryType = await SalaryType.findOne({ where: { id } });
  if (!salaryType) {
    return next(new NotFoundError("we coudln't find that salary type"));
  }
  const jobs = await salaryType.getJobs();
  if (!jobs || jobs?.length === 0) {
    return next(
      new NotFoundError("we couldn't find any jobs for that salary type")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      salaryType,
      jobs,
    },
  });
});

const findJobsByEmploymentContractTypeId = catchAsync(async function(req, res, next) {
  const { id } = req.params;

  const contractType = await EmploymentContractType.findOne({ where: { id } });
  if (!contractType) {
    return next(new NotFoundError("we coudln't find that salary type"));
  }
  const jobs = await contractType.getJobs();
  if (!jobs || jobs?.length === 0) {
    return next(
      new NotFoundError("we couldn't find any jobs for that salary type")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      contractType,
      jobs,
    },
  });
});

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findJobsByLocation,
  findJobsByCategory,
  findJobsByCategoryAndLocation,
  findBySalaryTypeId,
  findJobsByEmploymentContractTypeId,
};

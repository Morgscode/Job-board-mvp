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
const { JobApplication } = require('../models/jobApplicationModel');

const _index = catchAsync(async function (req, res, next) {
  const jobs = await model.Job.findAll({
    attributes: req.sql.attributes,
    where: { ...req.sql.where },
    order: req.sql.order,
    ...req.pagination,
  });
  if (!jobs) {
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
  const { locations = [], categories = [], employment_contract_type_id, salary_type_id } = req.body;

  if (locations?.length === 0 || categories?.length === 0) {
    return next(new AppError('missing job location and/or category', 400));
  }

  if (!employment_contract_type_id || !salary_type_id) {
    return next(new AppError('missing job salary type and/or contract type', 400));
  }

  const record = await model.Job.create(job);
  if (!record) {
    return next(new AppError('error - unable to create job', 500, false));
  }

  const jobSalaryType = await record.setSalaryType(salary_type_id);

  const jobContractType = await record.setEmploymentContractType(employment_contract_type_id);

  const inLocations = await Promise.all(
    locations.map(async (location) => await record.addLocation(location))
  );

  const inCategories = await Promise.all(
    categories.map(async (category) => await record.addCategory(category))
  );

  res.status(201).json({
    status: 'success',
    data: {
      job: record.toJSON(),
    },
  });
});

const _update = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const job = ({ title, salary, description, deadline } = req.body);
  const { locations = [], categories = [], salary_type_id, employment_contract_type_id } = req.body;

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

  if (salary_type_id) {
    await record.setSalaryType(salary_type_id);
  }

  if (employment_contract_type_id) {
    await record.setEmploymentContractType(employment_contract_type_id);
  }

  if (locations.length > 0) {
    await Promise.all(
      locations.map(async (location) => {
        const locationRecord = await JobsInLocations.findOne({
          where: { JobId: record.id, LocationId: location },
        });
        if (!locationRecord) {
          return await record.addLocation(location);
        }
      })
    );
  }
 
  if (categories.length > 0) {
    await Promise.all(
      categories.map(async (category) => {
        const catRecord = await JobsInCategories.findOne({
          where: { jobCategoryId: category, jobId: record.id },
        });
        if (!catRecord) {
          return await record.addCategory(category);
        }
      })
    );
  }

  res.status(200).json({ status: 'success', data: { updated } });
});

const _delete = catchAsync(async function (req, res, next) {
  const { id } = req.params;
  const deleted = await model.Job.destroy({ where: { id } });
  res.status(200).json({ status: 'success', data: { deleted } });
});

const findByLocation = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const location = await Location.findOne({ where: { id } });
  if (!location) {
    return next(new NotFoundError("we coudln't find that location"));
  }

  const jobs = await location.getJobs();
  if (!jobs) {
    return next(
      new NotFoundError("we couldn't find any jobs at that location")
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
});

const findByCategory = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const category = await JobCategory.findOne({ where: { id } });
  if (!category) {
    return next(new NotFoundError("we coudln't find that category"));
  }

  const jobs = await category.getJobs();
  if (!jobs) {
    return next(
      new NotFoundError("we couldn't find any jobs in that category")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
});

const findByCategoryAndLocation = catchAsync(async function (
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
  if (!jobs) {
    return next(new NotFoundError("we couldn't find any jobs", 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
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
  if (!jobs) {
    return next(
      new NotFoundError("we couldn't find any jobs for that salary type")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
});

const findByEmploymentContractTypeId = catchAsync(async function(req, res, next) {
  const { id } = req.params;

  const contractType = await EmploymentContractType.findOne({ where: { id } });
  if (!contractType) {
    return next(new NotFoundError("we coudln't find that salary type"));
  }
  const jobs = await contractType.getJobs();
  if (!jobs) {
    return next(
      new NotFoundError("we couldn't find any jobs for that salary type")
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
});

const findByJobApplicationId = catchAsync(async function(req, res, next) {
  const { id } = req.params;

  const application = await JobApplication.findOne({where: {id, }});
  if (!application) {
    return next(new NotFoundError('application not found'));
  }

  const job = await application.getJob();
  if (!job ) {
    return next(new NotFoundError('job not found'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job
    }
  })
}); 

module.exports = {
  _index,
  _find,
  _create,
  _update,
  _delete,
  findByLocation,
  findByCategory,
  findByCategoryAndLocation,
  findBySalaryTypeId,
  findByEmploymentContractTypeId,
  findByJobApplicationId
};

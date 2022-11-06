const userModel = require('./userModel');
const locationModel = require('./locationModel');
const jobModel = require('./jobModel');
const jobCategoryModel = require('./jobCategoryModel');
const jobsInCategoriesModel = require('./jobsInCategoriesModel');
const jobsInLocationsModel = require('./jobsInLocationsModel');

const User = userModel.User;
const Location = locationModel.Location;
const Job = jobModel.Job;
const JobCategory = jobCategoryModel.JobCategory;
const JobsInCategories = jobsInCategoriesModel.JobsInCategories;
const JobsInLocations = jobsInLocationsModel.JobsInLocations;

Job.belongsToMany(JobCategory, {through: JobsInCategories});
JobCategory.belongsToMany(Job, {through: JobsInCategories});

Job.belongsToMany(Location, {through: JobsInLocations});
Location.belongsToMany(Job, {through: JobsInLocations});

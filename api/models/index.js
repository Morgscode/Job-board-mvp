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

Job.belongsToMany(JobCategory, { through: JobsInCategories });
JobCategory.belongsToMany(Job, { through: JobsInCategories });

Job.belongsToMany(Location, { through: JobsInLocations });
Location.belongsToMany(Job, { through: JobsInLocations });

// use this to force db table refreshes
// warning - this will kill ALL db data;
const force = false;

if (process.env.NODE_ENV === 'development') {
  Job.sync({force,})
    .then(() => console.log('jobs table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  JobCategory.sync({force,})
    .then(() => console.log('job cats table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  Location.sync({force,})
    .then(() => console.log('Locations table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  JobsInCategories.sync({force,})
    .then(() => console.log('jobs in cats table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  JobsInLocations.sync({force,})
    .then(() => console.log('jobs in cats table synced'))
    .catch((err) => console.error(err));
}
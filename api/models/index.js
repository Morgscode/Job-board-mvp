const { User } = require('./userModel');
const { Job } = require('./jobModel');
const { Location } = require('./locationModel');
const { JobCategory } = require('./jobCategoryModel');
const { JobsInCategories } = require('./jobsInCategoriesModel');
const { JobsInLocations } = require('./jobsInLocationsModel');

Job.belongsToMany(JobCategory, { through: {model: JobsInCategories,} });
JobCategory.belongsToMany(Job, { through: {model: JobsInCategories,} });

Job.belongsToMany(Location, { through: {model: JobsInLocations,} });
Location.belongsToMany(Job, { through: {model: JobsInLocations,} });

// use this to force db table refreshes
// warning - this will kill ALL db data;
const force = false;
const alter = false;

if (process.env.NODE_ENV === 'development') {
  User.sync({ force, alter })
    .then(() => console.log('users table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  Job.sync({ force, alter })
    .then(() => console.log('jobs table synced'))
    .catch((err) => console.error(err));
}
 
if (process.env.NODE_ENV === 'development') {
  JobCategory.sync({ force, alter })
    .then(() => console.log('job cats table synced')) 
    .catch((err) => console.error(err));
}  

if (process.env.NODE_ENV === 'development') {
  Location.sync({ force, alter })
    .then(() => console.log('Locations table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  JobsInCategories.sync({ force, alter })
    .then(() => console.log('jobs in cats table synced'))
    .catch((err) => console.error(err));
}

if (process.env.NODE_ENV === 'development') {
  JobsInLocations.sync({ force, alter })
    .then(() => console.log('jobs in locations table synced'))
    .catch((err) => console.error(err));
}

const userModel = require('./userModel');
const jobModel = require('./jobModel');
const jobCategoryModel = require('./jobCategoryModel');
const jobsInCategoriesModel = require('./jobsInCategoriesModel');

const User = userModel.User;
const Job = jobModel.Job;
const JobCategory = jobCategoryModel.JobCategory;
const JobsInCategories = jobsInCategoriesModel.JobsInCategories; 

Job.belongsToMany(JobCategory, {through: JobsInCategories});
JobCategory.belongsToMany(Job, {through: JobsInCategories});



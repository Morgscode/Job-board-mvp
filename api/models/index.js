const db = require('../utils/db');
const { User } = require('./userModel');
const { Job } = require('./jobModel');
const { Location } = require('./locationModel');
const { FileUpload } = require('./fileUploadModel');
const { JobsInLocations } = require('./jobsInLocationsModel');
const { JobCategory } = require('./jobCategoryModel');
const { JobsInCategories } = require('./jobsInCategoriesModel');
const { JobApplicationStatus } = require('./jobApplicationStatusModel');
const { JobApplication } = require('./jobApplicationModel');

Job.belongsToMany(JobCategory, {
  through: { model: JobsInCategories, unique: false, paranoid: true },
  as: 'Category'
});
JobCategory.belongsToMany(Job, { 
  through: { model: JobsInCategories, unique: false, paranoid: true },
});  
 
Job.belongsToMany(Location, { 
  through: { model: JobsInLocations, unique: false, paranoid: true },
});
Location.belongsToMany(Job, {
  through: { model: JobsInLocations, unique: false, paranoid: true },
});
 
User.hasMany(FileUpload);
FileUpload.belongsTo(User);

User.hasMany(JobApplication);
JobApplication.belongsTo(User);

FileUpload.hasMany(JobApplication, {foreignKey: 'CvId'});
JobApplication.belongsTo(FileUpload, {foreignKey: 'CvId'});
 
JobApplicationStatus.hasMany(JobApplication);
JobApplication.belongsTo(JobApplicationStatus);
  
const FORCE = false;
const ALTER = false;
const force = process.env.NODE_ENV === 'production' ? false : FORCE;
const alter = process.env.NODE_ENV === 'production' ? false : ALTER;
 
async function initModels() {
  return new Promise(async (resolve, reject) => {
    try {
      await User.sync({ force, alter });
      await Job.sync({ force, alter });
      await JobCategory.sync({ force, alter });
      await JobsInCategories.sync({ force, alter });
      await Location.sync({ force, alter });
      await JobsInLocations.sync({ force, alter });
      await JobApplicationStatus.sync({ force, alter });
      await FileUpload.sync({ force, alter });
      await JobApplication.sync({ force, alter });
      resolve('models synced - app data layer running');
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

initModels()
  .then((message) => console.log(message))
  .catch((err) => {
    console.log('could not reliably sync the models - shutting down...');
    process.exit(1);
  });

const { User } = require('./userModel');
const { SalaryType } = require('./salaryTypeModel');
const { EmploymentContractType } = require('./employmentContractTypeModel');
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
  as: 'Category',
  foreignKey: 'job_id' 
});
JobCategory.belongsToMany(Job, {
  through: { model: JobsInCategories, unique: false, paranoid: true },
  foreignKey: 'job_category_id'
});

Job.belongsToMany(Location, {
  through: { model: JobsInLocations, unique: false, paranoid: true },
  foreignKey: 'job_id'
});
Location.belongsToMany(Job, {
  through: { model: JobsInLocations, unique: false, paranoid: true },
  foreignKey: 'location_id'
});

EmploymentContractType.hasMany(Job, {foreignKey: 'employment_contract_type_id'});
Job.belongsTo(EmploymentContractType, {foreignKey: 'employment_contract_type_id'});

SalaryType.hasMany(Job, {foreignKey: 'salary_type_id'});
Job.belongsTo(SalaryType, {foreignKey: 'salary_type_id'});

User.hasMany(FileUpload, {foreignKey: 'user_id'});
FileUpload.belongsTo(User, {foreignKey: 'user_id'});
 
User.hasMany(JobApplication, {foreignKey: 'user_id'});
JobApplication.belongsTo(User, {foreignKey: 'user_id'}); 

FileUpload.hasMany(JobApplication, { foreignKey: 'cv_id' });
JobApplication.belongsTo(FileUpload, { foreignKey: 'cv_id' });

Job.hasMany(JobApplication, {foreignKey: 'job_id'});
JobApplication.belongsTo(Job, {foreignKey: 'job_id'});

JobApplicationStatus.hasMany(JobApplication, {foreignKey: 'job_application_status_id'});
JobApplication.belongsTo(JobApplicationStatus, {foreignKey: 'job_application_status_id'});

const FORCE = false;
const ALTER = false;
const force = process.env.NODE_ENV === 'production' ? false : FORCE;
const alter = process.env.NODE_ENV === 'production' ? false : ALTER;

async function initModels() {
  return new Promise(async (resolve, reject) => {
    try {
      const tables = [
        await User.sync({ force, alter }),
        await SalaryType.sync({ force, alter }),
        await EmploymentContractType.sync({ force, alter }),
        await Job.sync({ force, alter }),
        await JobCategory.sync({ force, alter }),
        await JobsInCategories.sync({ force, alter }),
        await Location.sync({ force, alter }),
        await JobsInLocations.sync({ force, alter }),
        await JobApplicationStatus.sync({ force, alter }),
        await FileUpload.sync({ force, alter }),
        await JobApplication.sync({ force, alter }),
      ];
      const result = await Promise.all(tables);
      resolve(result);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

initModels()
  .then((tables) => console.log(tables))
  .catch((err) => {
    console.log('could not reliably sync the models - shutting down...');
    process.exit(1);
  });

module.exports = { initModels };

const db = require('../utils/db');
const { User } = require('./userModel');
const { Job } = require('./jobModel');
const { Location } = require('./locationModel');
const { JobCategory } = require('./jobCategoryModel');
const { JobsInCategories } = require('./jobsInCategoriesModel');
const { JobsInLocations } = require('./jobsInLocationsModel');

Job.belongsToMany(JobCategory, {
  through: { model: JobsInCategories, unique: false, paranoid: true },
  as: 'JobToCategory'
});
JobCategory.belongsToMany(Job, {
  through: { model: JobsInCategories, unique: false, paranoid: true },
  as: 'CategoryToJob'
});

Job.belongsToMany(Location, {
  through: { model: JobsInLocations, unique: false, paranoid: true },
  as: 'JobToLocation'
});
Location.belongsToMany(Job, {
  through: { model: JobsInLocations, unique: false, paranoid: true },
  as: 'LocationToJob'
});

const force = false;
const alter = false;

async function initModels() {
  return new Promise(async (resolve, reject) => {
    try {
      await User.sync({ force, alter });
      await Job.sync({ force, alter }); 
      await JobCategory.sync({ force, alter });
      await Location.sync({ force, alter }); 
      await JobsInCategories.sync({ force, alter });
      await JobsInLocations.sync({ force, alter });
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

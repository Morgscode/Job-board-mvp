const { User } = require('./userModel');
const { Job } = require('./jobModel');
const { Location } = require('./locationModel');
const { JobCategory } = require('./jobCategoryModel');
const { JobsInCategories } = require('./jobsInCategoriesModel');
const { JobsInLocations } = require('./jobsInLocationsModel');

Job.belongsToMany(JobCategory, { through: { model: JobsInCategories, unique: false, paranoid: true, }});
JobCategory.belongsToMany(Job, { through: { model: JobsInCategories, unique: false, paranoid: true, }});

Job.belongsToMany(Location, { through: { model: JobsInCategories, unique: false, paranoid: true, }});
Location.belongsToMany(Job, { through: { model: JobsInCategories, unique: false, paranoid: true, }});

const force = false;
const alter = false; 

async function initModels() {
  try {
    await User.sync({ force, alter });
    await Job.sync({ force, alter });
    await JobCategory.sync({ force, alter });
    await Location.sync({ force, alter });
    await JobsInCategories.sync({ force, alter }); 
    await JobsInLocations.sync({ force, alter });
  } catch (error) {
    console.error(error);
    console.log('we couldn\'t reliably sync the db - shutting down');
    process.exit(1);
  }
} 
initModels();


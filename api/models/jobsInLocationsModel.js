const { Sequelize, DataTypes } = require('sequelize');
const db = require('../utils/db');

const JobsInLocations = db.sequelize.define(
  'JobInLocation',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        isInt: true,
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        isInt: true,
      },
    },
  },
  {
    tableName: 'jb_jobs_in_locations',
    paranoid: true,
  }
);

if (process.env.NODE_ENV === 'development') {
    JobsInLocations.sync()
    .then(() => console.log('jobs in cats table synced'))
    .catch((err) => console.error(err));
}

module.exports = { JobsInLocations };

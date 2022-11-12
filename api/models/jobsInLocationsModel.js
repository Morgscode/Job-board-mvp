const { DataTypes } = require('sequelize');
const db = require('../utils/db');
const { Job } = require('./jobModel');
const { Location } = require('./locationModel');

const JobsInLocations = db.sequelize.define(
  'JobInLocation',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    JobId: {
      type: DataTypes.INTEGER,
      references: {
        model: Job,
        key: 'id'
      }
    },
    LocationId: {
      type: DataTypes.INTEGER,
      references: {
        model: Location,
        key: 'id'
      }
    },
  },
  {
    tableName: 'jb_jobs_in_locations',
    paranoid: true,
  }
);

module.exports = { JobsInLocations };

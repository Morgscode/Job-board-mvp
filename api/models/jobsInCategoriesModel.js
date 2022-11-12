const { DataTypes } = require('sequelize');
const db = require('../utils/db');
const { Job } = require('./jobModel');
const { JobCategory } = require('./jobCategoryModel');

const JobsInCategories = db.sequelize.define(
  'JobInCategory',
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
    JobCategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: JobCategory,
        key: 'id'
      }
    },
  },
  {
    tableName: 'jb_jobs_in_categories',
    paranoid: true,
  }
);

module.exports = { JobsInCategories };

const { Sequelize, DataTypes } = require('sequelize');
const db = require('../utils/db');

const JobsInCategories = db.sequelize.define(
  'JobInCategory',
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
    jobCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
        isInt: true,
      },
    },
  },
  {
    tableName: 'jb_jobs_in_categories',
    paranoid: true,
  }
);

module.exports = { JobsInCategories };

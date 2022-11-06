const { Sequelize, DataTypes } = require('sequelize');
const db = require('../utils/db');

const JobsInCategories = db.sequelize.define(
  'JobCategory',
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

if (process.env.NODE_ENV === 'development') {
    JobsInCategories.sync()
    .then(() => console.log('jobs in cats table synced'))
    .catch((err) => console.error(err));
}

module.exports = { JobsInCategories };

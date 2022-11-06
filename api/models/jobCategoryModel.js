const { Sequelize, DataTypes } = require('sequelize');
const db = require('../utils/db');

const JobCategory = db.sequelize.define(
  'JobCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: true,
        isInt: true,
        isIn: [[0, 1]],
      },
    },
  },
  {
    tableName: 'jb_job_categories',
    paranoid: true,
  }
);

if (process.env.NODE_ENV === 'development') {
  JobCategory.sync()
    .then(() => console.log('job cats table synced'))
    .catch((err) => console.error(err));
}

module.exports = { JobCategory };

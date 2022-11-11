const { DataTypes } = require('sequelize');
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
      allowNull: true,
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

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} job 
 * @param {obejct} where 
 * @returns Object
 */
 async function _update(category, where) {
  if ('id' in category) delete category.id;
  return await JobCategory.update(category, {where,});
}

module.exports = { JobCategory, _update };

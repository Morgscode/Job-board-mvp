const { DataTypes } = require('sequelize');
const moment = require('moment');
const db = require('../utils/db');
const { Job } = require('./jobModel');
const { User } = require('./userModel');
const { JobApplicationStatus } = require('./jobApplicationStatusModel');

const JobApplication = db.sequelize.define(
  'JobApplication',
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
        key: 'id',
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    coveringLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    JobApplicationStatusId: {
      type: DataTypes.INTEGER,
      references: {
        model: JobApplicationStatus,
        key: 'id',
      },
    },
    // TODO - FileUpload Model
    // cvId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: CV,
    //     key: 'id',
    //   },
    // },
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
    tableName: 'jb_job_applications',
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} job
 * @param {obejct} where
 * @returns Object
 */
async function _update(application, where) {
  if ('id' in application) delete application.id;
  return await JobApplication.update(application, { where });
}

module.exports = { JobApplication, _update };

const { DataTypes } = require('sequelize');
const moment = require('moment');
const db = require('../utils/db');

const JobApplicationStatus = db.sequelize.define(
  'JobApplicationStatus',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'ojb_job_application_status',
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} status - the status to update
 * @param {obejct} where - sql where clause
 * @returns Object
 */
async function _update(status, where) {
  if ('id' in status) delete status.id;
  return await JobApplicationStatus.update(status, { where });
}

module.exports = { JobApplicationStatus, _update };

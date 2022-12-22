const { DataTypes } = require('sequelize');
const moment = require('moment');
const db = require('./../utils/db');
const { User } = require('./userModel');

const FileUpload = db.sequelize.define(
  'FileUpload',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true, 
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'ojb_file_uploads',
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} status - the status to update
 * @param {obejct} where - sql where clause
 * @returns Object
 */
async function _update(file, where) {
  if ('id' in file) delete file.id;
  if ('user_id' in file) delete file.user_id;
  if ('mimetype' in file) delete file.mimetype;
  if ('path' in file) delete file.path;
  if ('name' in file) delete file.name; 
  return await FileUpload.update(file, { where });
}

module.exports = {
  FileUpload, _update
};

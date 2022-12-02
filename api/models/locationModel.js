const { DataTypes } = require('sequelize');
const db = require('./../utils/db');

const Location = db.sequelize.define(
  'Location',
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
    tableName: 'ojb_locations',
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} location - the location to update
 * @param {obejct} where - the sql where clause
 * @returns Object
 */
async function _update(location, where) {
  if ('id' in location) delete location.id;
  return await Location.update(location, { where });
}

module.exports = { Location, _update };

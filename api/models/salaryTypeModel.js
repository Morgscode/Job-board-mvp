const { DataTypes } = require("sequelize");
const db = require("./../utils/db");

const SalaryType = db.sequelize.define(
  "SalaryType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ojb_salary_types",
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} status - the status to update
 * @param {obejct} where - sql where clause
 * @returns Object
 */
async function _update(type, where) {
  if ("id" in type) delete type.id;
  return await SalaryType.update(type, { where });
}

module.exports = { SalaryType, _update };

const { DataTypes } = require("sequelize");
const db = require("./../utils/db");
const { Job } = require("./jobModel");
const { JobCategory } = require("./jobCategoryModel");

const JobsInCategories = db.sequelize.define(
  "JobInCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Job,
        key: "id",
      },
    },
    job_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: JobCategory,
        key: "id",
      },
    },
  },
  {
    tableName: "ojb_jobs_in_categories",
    paranoid: true,
  }
);

module.exports = { JobsInCategories };

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const auth = require('../utils/auth');

const User = db.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        notNull: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isNumeric: true,
        notNull: true,
        isIn: [[1, 2, 3,]],
      },
    },
  },
  {
    tableName: 'jb_users',
    paranoid: true,
  }
);

async function userEmailExists(email) {
  const user = await User.findOne({ where: { email } });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function registerUser(email, password) {
  try {
    let hash = await bcrypt.hash(password, 8);
    const user = await User.create({ email, password: hash, role: 1 });
    return user.dataValues;
  } catch (error) {
    return false;
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error();
    }
    const passwordMatch = await auth.verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new Error();
    }
    return user.dataValues;
  } catch (error) {
    return false;
  }
}

module.exports = { User, userEmailExists, registerUser, loginUser };

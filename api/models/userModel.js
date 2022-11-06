const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
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
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'jb_users',
  }
);

User.sync()
  .then(() => console.log('users table synced'))
  .catch((err) => console.error(err));

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
    return user;
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
    return user;
  } catch (error) {
    return false;
  }
}

module.exports = { userEmailExists, registerUser, loginUser };

const { DataTypes } = require('sequelize');
const moment = require('moment');
const bcrypt = require('bcrypt');
const db = require('./../utils/db');
const auth = require('./../utils/auth');

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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middleNames: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isNumeric: true,
        notNull: true,
        isIn: [[1, 2]],
      },
    },
    emailVerifyToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordRefreshedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'ojb_users',
    paranoid: true,
  }
);

/**
 * A model specific update function which will prepare user input for db insertion
 * @param {object} location - the location to update
 * @param {obejct} where - the sql where clause
 * @returns Object
 */
 async function _update(user, where) {
  if ('id' in user) delete user.id;
  if ('role' in user) delete user.role;
  if ('password' in user) delete user.password;
  if ('passwordResetToken' in user) delete user.passwordResetToken;
  if ('passwordResetExpires' in user) delete user.passwordResetExpires;
  if ('psswordRefreshedAt' in user) delete user.passwordRefreshedAt;
  if ('email' in user) delete user.email;
  if ('emailVerifyToken' in user) delete user.emailVerifyToken;
  if ('emailVerifiedAt' in user) delete user.emailVerifiedAt;
  return await User.update(user, { where });
}

async function userEmailExists(email) {
  const user = await User.findOne({ where: { email } });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function registerUser(email, password, role = 1) {
  try {
    let hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, role, });
    return user;
  } catch (error) {
    console.error(error);
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
    return user.toJSON();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function apiUser(user) {
  if ('password' in user) delete user['password'];
  if ('passwordResetToken' in user) delete user['passwordResetToken'];
  if ('passwordResetExpires' in user) delete user['passwordResetExpires'];
  if ('passwordRefreshedAt' in user) delete user['passwordRefreshedAt'];
  if ('emailVerifyToken' in user) delete user['emailVerifyToken'];
  return user;
}

async function updatePassword(user, password) {
  if (!user instanceof User) throw new Error('you must pass in a valid user');
  let hash = await bcrypt.hash(password, 12);
  user.password = hash;
  user.passwordResetExpires = null;
  user.passwordResetToken = null;
  user.passwordRefreshedAt = moment();
  await user.save();
  return true;
}

module.exports = {
  User,
  userEmailExists,
  registerUser,
  loginUser,
  apiUser,
  updatePassword,
  _update,
};

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
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middle_names: {
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
    email_verify_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_refreshed_at: {
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
  if ('password_reset_token' in user) delete user.password_reset_token;
  if ('password_reset_expires' in user) delete user.password_reset_expires;
  if ('pssword_refreshed_at' in user) delete user.pssword_refreshed_at;
  if ('email' in user) delete user.email;
  if ('email_verify_token' in user) delete user.email_verify_token;
  if ('email_verified_at' in user) delete user.email_verified_at;
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

async function registerUser(user, password, role = 1) {
  try {
    let hash = await bcrypt.hash(password, 12);
    const record = await User.create({ ...user, password: hash, role, });
    return record;
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
  if ('password_reset_token' in user) delete user['password_reset_token'];
  if ('password_reset_expires' in user) delete user['password_reset_expires'];
  if ('password_refreshed_at' in user) delete user['password_refreshed_at'];
  if ('email_verify_token' in user) delete user['email_verify_token'];
  return user;
}

async function updatePassword(user, password) {
  if (!user instanceof User) throw new Error('you must pass in a valid user');
  let hash = await bcrypt.hash(password, 12);
  user.password = hash;
  user.password_reset_expires = null;
  user.password_reset_token = null;
  user.password_refreshed_at = moment();
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

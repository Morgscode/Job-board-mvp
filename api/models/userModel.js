const { DataTypes } = require('sequelize');
const moment = require('moment');
const bcrypt = require('bcrypt');
const db = require('./../utils/db');
const auth = require('./../utils/auth');
const Mailer = require('../utils/Mailer');

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
        isIn: [[1, 2, 3]],
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
  let hash = await bcrypt.hash(password.toString(), 12);
  const record = await User.create({ ...user, password: hash, role });
  return record;
}

async function requestEmailVerify(user) {
  if (!user instanceof User) throw new Error('you must pass in a valid user');
  // set verify token
  const verify = auth.createAppToken();
  user.email_verify_token = verify.hash;
  await user.save();

  // send email
  const mailer = new Mailer();
  mailer.setOption('to', user.email);
  mailer.setOption(
    'subject',
    'Your email address has been registered with OJB. Please verify your email'
  );
  const data = {
    firstName: user.first_name,
    url: encodeURI(
      `${process.env.JOBFINDER_SITE_URL}/verify-email?email=${user.email}&token=${verify.token}`
    ),
  };
  mailer.renderTemplate('verify-email', data);
  await mailer.send();
}

async function requestPasswordReset(user) {
  if (!user instanceof User) throw new Error('you must pass in a valid user');

  const reset = auth.createAppToken();
  user.password_reset_token = reset.hash;
  user.password_reset_expires = moment().add(15, 'minutes');
  await user.save();

  const mailer = new Mailer();
  mailer.setOption('to', user.email);
  mailer.setOption('subject', 'Password reset request');
  const data = {
    firstName: user.first_name,
    url: encodeURI(
      `${process.env.JOBFINDER_SITE_URL}/reset-password?email=${user.email}&token=${reset.token}`
    ),
  };
  mailer.renderTemplate('reset-password', data);
  await mailer.send();
}

async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Email invalid');
  }
  const passwordMatch = await auth.verifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new Error('Password invalid');
  }
  return user.toJSON();
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
  requestEmailVerify,
  requestPasswordReset,
  loginUser,
  apiUser,
  updatePassword,
  _update,
};

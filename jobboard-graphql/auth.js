const jwt = require('jsonwebtoken');

/**
 * will attemp to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} token jwt from client
 */
const getUserFromToken = token => {
  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET)
    return user;
  } catch (e) {
    return null
  }
}

/**
 * checks if the user is on the context object
 * continues to the next resolver if true
 * @param {Function} next next resolver function ro run
 */
const authenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new Error('need a user');
  }

  return next(root, args, context, info);
}

/**
 * checks if the user on the context has the specified role.
 * continues to the next resolver if true
 * @param {String} role enum role to check for
 * @param {Function} next next resolver function to run
 */
const authorized = (role, next) => (root, args, context, info) => {
  if (!context.user.role === role) {
    throw new Error('wrong role');
  }

  return next(root, args, context, info);
}

module.exports = {
  getUserFromToken,
  authenticated,
  authorized,
}
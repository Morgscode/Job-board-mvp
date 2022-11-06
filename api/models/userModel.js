const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const auth = require('../utils/auth');

async function userEmailExists(email) {
  let sql = 'SELECT `email` FROM `jb_users` WHERE `jb_users`.`email` = ?';
  const inserts = [email];
  sql = mysql.format(sql, inserts);
  const emailRecords = await db._query(sql);
  if (Array.isArray(emailRecords) && emailRecords.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function registerUser(email, password) {
  let sql = 'INSERT INTO `jb_users` (email, password, role) VALUES (?, ?, 1)';
  try {
    let hash = await bcrypt.hash(password, 8);
    const inserts = [email, hash];
    sql = mysql.format(sql, inserts);
    const user = await db._query(sql);
    return user['insertId'];
  } catch (error) {
    return false;
  }
}

async function loginUser(email, password) {
  let sql =
    'SELECT `id`, `email`, `password`, `role` FROM `jb_users` WHERE `jb_users`.`email` = ?';
  const inserts = [email];
  sql = mysql.format(sql, inserts);
  try {
    const user = await db._query(sql);
    if (Array.isArray(user) && user.length === 0) {
      throw new Error();
    }
    const pass = await auth.verifyPassword(password, user[0].password);
    if(!pass) {
      throw new Error();
    }
    return user[0];
  } catch (error) {
    return false;
  }
}

module.exports = { userEmailExists, registerUser, loginUser };
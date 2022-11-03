const mysql = require('mysql');
const db = require('../utils/db');
const bcrypt = require('bcrypt');

async function userEmailExists(email) {
    let sql = "SELECT `email` FROM `jb_users` WHERE `jb_users`.`email` = ?";
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
    try {
        let hash = await bcrypt.hash(password, 8);
        let sql = "INSERT INTO `jb_users` (email, password) VALUES (?, ?)";
        const inserts = [email, hash];
        sql = mysql.format(sql, inserts);
        const user = await db._query(sql);
        return user;
    } catch (error) {
        return false;
    }
}

module.exports = { userEmailExists, registerUser }


require('dotenv').config({ path: '././.env.local' });
const mySql = require('mysql2/promise');

const SQL_CONFIGURATION_DATA = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  charset: process.env.MYSQL_CHARSET,
}

const pool = mySql.createPool(SQL_CONFIGURATION_DATA);

exports.makeQuery = async function (queryString, params = []) {
    let returnObject;
    try {
        const [rows] = await pool.execute(queryString, params);
        returnObject = rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
    return returnObject;
};

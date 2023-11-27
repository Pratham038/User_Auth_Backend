require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
    createTablesIfNotExist();
  }
});

function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function createTablesIfNotExist() {
  const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_bio VARCHAR(255) ,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
  )`;
  const createAccessTokenQuery = `CREATE TABLE IF NOT EXISTS access_tokens (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  user_email VARCHAR(255) NOT NULL ,
  token VARCHAR(255) UNIQUE NOT NULL,
  expiration_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);`;

  executeQuery(createUsersTableQuery)
    .then(() => executeQuery(createAccessTokenQuery))
    // add your other tables query same as above
    .then(() => {
      console.log("Tables created (if not exists)");
    })
    .catch((error) => {
      console.error("Error creating tables:", error);
    });
}

module.exports = { connection, executeQuery };

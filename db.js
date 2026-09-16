require('dotenv').config(); // Carga las variables del .env a process.env
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, // si no hay conexión libre espera en vez de fallar
  connectionLimit: 10       // máximo de conexiones simultáneas en el pool
});

// mysql2 permite usar promesas (async/await) en vez de callbacks anidados
module.exports = pool.promise();
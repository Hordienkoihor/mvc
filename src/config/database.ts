import mysql, {type Pool} from "mysql2/promise";
import {config} from "dotenv";

config()

export const dbPool: Pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    // database: process.env.DB_NAME  || 'test',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
})
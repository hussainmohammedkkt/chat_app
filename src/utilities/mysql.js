
import { env } from "process";
const mysql = require('mysql');
export const mysql_pool = mysql.createPool({
	connectionLimit: 10,
	host: env.DBHOST,
	user: env.DBUSER,
	password: env.DBPASSWORD,
	database: env.DBDATABASE,
	timezone: 'UTC',
	charset:'utf8mb4_bin'
});


export default mysql_pool;

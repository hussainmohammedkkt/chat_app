/**
 * Environment file
 */
 import './../env';

 import connPool from './utilities/mysql';
 const migration = require('mysql-migrations');
 
 migration.init(connPool,  __dirname + '/migrations');
 
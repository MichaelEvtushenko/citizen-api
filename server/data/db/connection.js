const knex = require('knex');
const knexConfig = require('../../libs/knexfile');

const env = process.env.NODE_ENV || 'development';

module.exports = knex(knexConfig[env]);

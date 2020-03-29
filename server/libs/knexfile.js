const path = require('path');

module.exports = {
    development: {
        client: 'pg',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './data/migrations'
        },
        seeds: {
            directory: './data/seeds'
        }
    },

    production: {
    }
};

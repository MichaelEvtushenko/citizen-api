const defaults = {
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
        directory: '../data/migrations'
    },
    seeds: {
        directory: '../data/seeds'
    }
};

module.exports = {
    development: defaults,
    production: defaults,
    test: {
        client: 'pg',
        connection: {
            database:'citizen-test',
            user: 'postgres',
            password: 'root',
            host: 'localhost',
        }
    }
};

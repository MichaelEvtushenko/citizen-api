exports.up = knex =>
    knex.schema.raw(`SET timezone = 'UTC-0'`);

exports.down = knex =>
    knex.schema.raw(`RESET timezone`);

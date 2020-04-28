exports.up = knex =>
    knex.schema.createTable('sessions', tableBuilder => {
        tableBuilder.uuid('refresh_token').primary();
        tableBuilder.integer('user_id').references('user_id').inTable('users')
            .index('idx_sessions_user_id').onDelete('CASCADE');
        tableBuilder.string('user_agent', 200).notNullable();
        tableBuilder.bigInteger('expired_at').notNullable();
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('sessions');

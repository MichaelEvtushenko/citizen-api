exports.up = knex =>
    knex.schema.createTable('auth_links', tableBuilder => {
        tableBuilder.uuid('link_id').primary();
        tableBuilder.bigInteger('exp').notNullable();
        tableBuilder.integer('user_id').references('user_id').inTable('users')
            .index('idx_auth_links_user_id').onDelete('CASCADE');
        tableBuilder.boolean('used').defaultTo(false);
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('auth_links');

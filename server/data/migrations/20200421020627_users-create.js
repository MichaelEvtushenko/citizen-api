exports.up = knex =>
    knex.schema.createTable('users', tableBuilder => {
        tableBuilder.increments('user_id');
        tableBuilder.string('email').notNullable().unique();
        tableBuilder.string('password', 60).notNullable();
        tableBuilder.string('full_name').notNullable();
        tableBuilder.timestamp('created_at').defaultTo('now()');
        tableBuilder.boolean('enabled').defaultTo(false);
        tableBuilder.enu('role', ['user', 'moderator', 'admin'],
            {useNative: true, enumName: 'roles'})
            .defaultTo('user');
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('users')
        .raw('DROP TYPE IF EXISTS roles');

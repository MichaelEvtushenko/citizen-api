exports.up = knex =>
    knex.schema.createTable('alerts', tableBuilder => {
        tableBuilder.increments('alert_id');
        tableBuilder.integer('user_id').references('user_id').inTable('users')
            .index('idx_alerts_user_id').onDelete('CASCADE');
        tableBuilder.decimal('latitude').notNullable();
        tableBuilder.decimal('longitude').notNullable();
        tableBuilder.text('description').notNullable();
        tableBuilder.timestamp('reported_at').defaultTo(knex.fn.now());
        tableBuilder.enu('status', ['red', 'yellow', 'grey'],
            {useNative: true, enumName: 'statuses'})
            .defaultTo('grey')
        tableBuilder.specificType('photo_urls', 'varchar(128)[]');
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('alerts')
        .raw('DROP TYPE IF EXISTS statuses');

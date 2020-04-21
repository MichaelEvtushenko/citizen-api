exports.up = knex =>
    knex.schema.createTable('approvals', tableBuilder => {
        tableBuilder.integer('alert_id').references('alert_id').inTable('alerts')
            .index('idx_approvals_alert_id').onDelete('CASCADE');
        tableBuilder.integer('user_id').references('user_id').inTable('users')
            .index('idx_approvals_user_id').onDelete('CASCADE');
        tableBuilder.boolean('approved');
        tableBuilder.primary(['alert_id', 'user_id']);
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('approvals');

exports.up = knex =>
    knex.schema.createTable('comments', tableBuilder => {
        tableBuilder.increments('comment_id');
        tableBuilder.integer('user_id').references('user_id').inTable('users')
            .index('idx_comments_user_id').onDelete('CASCADE');
        tableBuilder.integer('alert_id').references('alert_id').inTable('alerts')
            .index('idx_comments_alert_id').onDelete('CASCADE');
        tableBuilder.text('description');
        tableBuilder.timestamp('posted_at').defaultTo(knex.fn.now());
    });

exports.down = knex =>
    knex.schema.dropTableIfExists('comments');

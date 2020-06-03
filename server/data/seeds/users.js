exports.seed = knex => {
    return knex('users').del()
        .then(() => {
            return knex('users').insert([
                {
                    user_id: 1,
                    email: 'test@test.abc',
                    password: '$2b$12$pAfWQQo5h.0kNehDLWgUWu3G56ifV.Xk/7l6MzKfdOgpUt9KWVYIS',
                    full_name: 'test user',
                    created_at: knex.fn.now(),
                    enabled: true,
                    role: 'user'
                },
            ]);
        });
};

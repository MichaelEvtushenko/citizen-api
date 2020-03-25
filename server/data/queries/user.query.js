const knex = require('../db/connection');

const getById = id => {
    return knex('users')
        .select('*')
        .where('user_id', id);
};

const findByEmail = email => {
    return knex('users')
        .select('*')
        .where({email});
};

const create = user => {
    return knex('users')
        .insert({
            'email': user.email,
            'password': user.hash,
            'full_name': user.fullName,
            'created_at': new Date().toISOString()
        })
        .returning('*');
};

const update = ({userId, ...rest}) => {
    return knex('users')
        .where({
            'user_id': userId
        })
        .update({...rest})
        .returning('*');

};


module.exports = {
    getById,
    create,
    findByEmail,
    update,
};

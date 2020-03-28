const knex = require('../db/connection');
const mapper = require('../../helpers/query.helper')(rowMapper);

function rowMapper (entity) {
    const {user_id: userId, full_name: fullName, created_at: createdAt, ...rest} = entity;
    return {userId, fullName, createdAt, ...rest};
}

const getById = id => {
    return knex('users')
        .select('*')
        .where('user_id', id)
        .then(mapper);
};

const findByEmail = email => {
    return knex('users')
        .select('*')
        .where({email})
        .then(mapper);
};

const create = user => {
    return knex('users')
        .insert({
            'email': user.email,
            'password': user.hash,
            'full_name': user.fullName,
            'created_at': new Date().toISOString()
        })
        .returning('*')
        .then(mapper);
};

const update = ({userId, ...rest}) => {
    return knex('users')
        .where({
            'user_id': userId
        })
        .update({...rest})
        .returning('*')
        .then(mapper);

};

module.exports = {
    getById,
    create,
    findByEmail,
    update,
};

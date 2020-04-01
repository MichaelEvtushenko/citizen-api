const knex = require('../db/connection');
const {userMapper} = require('../../helpers/query.helper');

// TODO: fix method name
const getById = id => {
    return knex('users')
        .select('*')
        .where('user_id', id)
        .then(userMapper);
};

const findByEmail = email => {
    return knex('users')
        .select('*')
        .where({email})
        .then(userMapper);
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
        .then(userMapper);
};

// @Deprecated
const update = ({userId, ...rest}) => {
    return knex('users')
        .where({
            'user_id': userId
        })
        .update({...rest})
        .returning('*')
        .then(userMapper);
};

const enableUser = async userId => {
    await knex('users')
        .where({user_id: userId})
        .update({enabled: true});
};

const findByUserId = userId => {
    return knex('users')
        .where({user_id: userId})
        .select('*')
        .then(userMapper);
};

module.exports = {
    getById,
    create,
    findByEmail,
    update,
    enableUser,
    findByUserId,
};

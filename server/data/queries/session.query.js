const knex = require('../db/connection');
const {sessionMapper, userMapper} = require('../../helpers/query.helper');

const insert = async ({refreshToken, userId, expiredAt, userAgent}) => {
    await knex('sessions')
        .insert({
            refresh_token: refreshToken,
            user_id: userId,
            user_agent: userAgent,
            expired_at: expiredAt
        });
};

const findByRefreshToken = (refreshToken) => {
    return knex('sessions')
        .where({refresh_token: refreshToken})
        .select('*')
        .then(sessionMapper);
};

const deleteByUserId = async (userId) => {
    await knex('sessions')
        .where({user_id: userId})
        .del();
};

const updateRefreshToken = async ({refreshToken, newRefreshToken}) => {
    await knex('sessions')
        .where({refresh_token: refreshToken})
        .update({refresh_token: newRefreshToken});
};

const deleteByRefreshToken = async (refreshToken) => {
    await knex('sessions')
        .where({refresh_token: refreshToken})
        .del();
};

const joinUserByRefreshToken = (refreshToken) => {
    return knex('sessions')
        .where({'sessions.refresh_token': refreshToken})
        .join('users', 'users.user_id', 'sessions.user_id')
        .select('*')
        .then(sessionMapper)
        .then(userMapper);
};

module.exports = {
    insert,
    findByRefreshToken,
    deleteByUserId,
    updateRefreshToken,
    deleteByRefreshToken,
    joinUserByRefreshToken,
};

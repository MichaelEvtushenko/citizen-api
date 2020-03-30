const knex = require('../db/connection');
const mapper = require('../../helpers/query.helper')(rowMapper);

function rowMapper(entity) {
    const {refresh_token: refreshToken, user_id: userId, user_agent: userAgent, expired_at: expiredAt} = entity;
    return {refreshToken, userId, userAgent, expiredAt};
}

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
        .then(mapper);
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

module.exports = {
    insert,
    findByRefreshToken,
    deleteByUserId,
    updateRefreshToken,
};

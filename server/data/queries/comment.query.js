const knex = require('../db/connection');
const {commentMapper} = require('../../helpers/query.helper');

const insert = ({userId, alertId, description}) => {
    return knex('comments')
        .insert({
            user_id: userId,
            alert_id: alertId,
            description
        })
        .returning('*')
        .then(commentMapper);
};

const find = ({alertId, limit, offset}) => {
    return knex('comments')
        .select('*')
        .where({alert_id: alertId})
        .limit(limit)
        .offset(offset)
        .then(commentMapper);
};

const update = ({alertId, description}) => {
    return knex('comments')
        .update({description})
        .where({alert_id: alertId})
        .returning('*')
        .then(commentMapper);
};

module.exports = {
    insert,
    update,
    find,
};

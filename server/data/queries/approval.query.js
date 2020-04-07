const knex = require('../db/connection');
const {approvalMapper} = require('../../helpers/query.helper');

const insert = async ({userId, alertId, approve}) => {
    await knex('approvals')
        .insert({
            user_id: userId,
            alert_id: alertId,
            approve
        });
};

const countApprovals = (alertId) => {
    return knex('approvals')
        .where({
            alert_id: alertId,
            approve: true
        })
        .count('1');
};

const findByUserId = (userId) => {
    return knex('approvals')
        .where({user_id: userId})
        .select('*')
        .then(approvalMapper);
};

module.exports = {
    insert,
    countApprovals,
    findByUserId,
};

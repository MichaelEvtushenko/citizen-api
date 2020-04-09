const knex = require('../db/connection');
const {approvalMapper} = require('../../helpers/query.helper');

const insert = ({userId, alertId, approved}) => {
    return knex('approvals')
        .insert({
            user_id: userId,
            alert_id: alertId,
            approved
        }).returning('*')
        .then(approvalMapper);
};

const countApprovals = (alertId) => {
    return knex('approvals')
        .where({
            alert_id: alertId,
            approve: true
        })
        .count('1');
};

const findByAlertIdAndUserId = ({userId, alertId}) => {
    return knex('approvals')
        .where({
            user_id: userId,
            alert_id: alertId
        })
        .select('*')
        .then(approvalMapper);
};

const getStatistics = (alertId) => {
    return knex.raw(
            `SELECT count(*)                                      "allCount",
                        count(CASE WHEN (approved = true) THEN 1 END) "approvesCount"
                FROM approvals
                WHERE alert_id=?`, [alertId]);
};

module.exports = {
    insert,
    countApprovals,
    findByAlertIdAndUserId,
    getStatistics,
};

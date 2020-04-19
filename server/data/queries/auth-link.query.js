const knex = require('../db/connection');
const {authLinkMapper} = require('../../helpers/query.helper');

const insert = ({userId, exp, linkId}) => {
    return knex('auth_links')
        .insert({
            'link_id': linkId,
            'user_id': userId,
            'exp': exp,
        })
        .returning('*')
        .then(authLinkMapper);
};

const findByLinkId = linkId => {
    return knex('auth_links')
        .select('*')
        .where({
            'link_id': linkId,
        })
        .then(authLinkMapper);
};

const activateLink = linkId => {
    return knex('auth_links')
        .update({used: true})
        .where({
            link_id: linkId,
        })
        .returning('*')
        .then(authLinkMapper);
};

const findExpiredLink = date => {
    return knex('auth_links')
        .where('exp', '<', date)
        .then(authLinkMapper);
};

const deleteById = async linkId => {
    await knex('auth_links')
        .where({link_id: linkId})
        .del();
};

module.exports = {
    insert,
    findByLinkId,
    activateLink,
    findExpiredLink,
    deleteById,
};

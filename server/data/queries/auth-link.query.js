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

// TODO: fix ...rest
const update = ({linkId, ...rest}) => {
    return knex('auth_links')
        .update({
            ...rest
        })
        .where({link_id: linkId})
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

const activateLink = async linkId => {
    await knex('auth_links')
        .update({used: true})
        .where({
            link_id: linkId,
        });
};

module.exports = {
    insert,
    update,
    findByLinkId,
    activateLink,
};



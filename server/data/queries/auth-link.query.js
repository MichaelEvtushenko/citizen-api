const knex = require('../db/connection');

// TODO: fix score_case
const insert = ({user_id, exp, linkId}) => {
    console.log(user_id)
    return knex('auth_links')
        .insert({
            'link_id': linkId,
            'user_id': user_id,
            'exp': exp,
        })
        .returning('*');
};

const update = ({link_id, ...rest}) => {
    return knex('auth_links')
        .update({
            ...rest
        })
        .where({link_id})
        .returning('*');
};

const findByLinkId = (linkId) => {
    return knex('auth_links')
        .select('*')
        .where({
            'link_id': linkId
        });
};

module.exports = {
    insert,
    update,
    findByLinkId,
};



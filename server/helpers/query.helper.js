// map result set, iterating by each row
const resultSetMapper = rowMapper => res => res.length ? res.map(rowMapper || (v => v)) : res;

const userRowMapper = entity => {
    const {user_id: userId, full_name: fullName, created_at: createdAt, ...rest} = entity;
    return {userId, fullName, createdAt, ...rest};
};

const authLinkRowMapper = entity => {
    const {link_id: linkId, user_id: userId, ...rest} = entity;
    return {linkId, userId, ...rest};
};

const sessionRowMapper = entity => {
    const {
        refresh_token: refreshToken,
        user_id: userId,
        user_agent: userAgent,
        expired_at: expiredAt,
        ...rest
    } = entity;
    return {refreshToken, userId, userAgent, expiredAt, ...rest};
};

module.exports = {
    userMapper: resultSetMapper(userRowMapper),
    authLinkMapper: resultSetMapper(authLinkRowMapper),
    sessionMapper: resultSetMapper(sessionRowMapper),
};

const defaultExpiration = 1000 * 60 * 60 * 24; // 24 hours

module.exports = {
    saltRounds: process.env.SALT_ROUNDS || 12,
    authLinkExpiresIn: process.env.EXP_AUTH_LINK || defaultExpiration,
};

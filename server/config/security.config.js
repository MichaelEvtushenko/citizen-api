const defaultExpiration = 1000 * 60; // 1 minute

module.exports = {
    saltRounds: process.env.SALT_ROUNDS || 12,
    authLinkExpiresIn: process.env.EXP_AUTH_LINK || defaultExpiration,
};

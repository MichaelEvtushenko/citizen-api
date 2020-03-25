// TODO: enum
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

module.exports = {
    saltRounds: process.env.SALT_ROUNDS || 12,
    // authLinkExpiresIn: process.env.security.EXP_AUTH_LINK || MINUTE,
    authLinkExpiresIn: process.env.EXP_AUTH_LINK || MINUTE,
};

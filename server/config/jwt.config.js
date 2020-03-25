const secretKey = process.env.SECRET_KEY || 'dev-secret-key';

// TODO: enum
const SECOND = 1000;
const MINUTE = 60 * SECOND;

module.exports = {
    secretKey,
    expiresIn: MINUTE
};

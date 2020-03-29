const secretKey = process.env.SECRET_KEY || 'dev-secret-key';

module.exports = {
    secretKey,
    expiresIn: 1000 * 60, // 1 minute
};

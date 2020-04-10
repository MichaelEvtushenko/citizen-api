const secretKey = process.env.SECRET_KEY || 'dev-secret-key';

module.exports = {
    secretKey,
    accessTokenExpiresIn: 1000 * 60 * 10, // 10 minutes
    refreshTokenExpiresIn: 1000 * 60 * 60 * 24 * 60 // 60 days
};

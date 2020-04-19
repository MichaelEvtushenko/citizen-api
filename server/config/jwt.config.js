const secretKey = process.env.SECRET_KEY || '55B8B388D187C2F4457CD3DC3D733B924B4FFC54C1B25E89ACEBDFAF73B79C0C';

module.exports = {
    secretKey,
    accessTokenExpiresIn: 1000 * 60 * 10, // 10 minutes
    refreshTokenExpiresIn: 1000 * 60 * 60 * 24 * 60 // 60 days
};

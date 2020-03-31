const crypto = require('crypto');

const jwtConfig = require('../config/jwt.config');

const encodeToBase64 = data => Buffer.from(JSON.stringify(data)).toString('base64');
const decodeBase64 = data => JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

// TODO: remove unused params
const generateToken = ({userId, role}) => {
    const header = {
        alg: 'HS256',
        typ: 'jwt'
    };

    const payload = {
        sub: userId,
        exp: Date.now() + jwtConfig.accessTokenExpiresIn,
        role
    };

    const encodedHeader = encodeToBase64(header);
    const encodedPayload = encodeToBase64(payload);

    const encodedSignature = crypto.createHmac('SHA256', jwtConfig.secretKey).update(
        `${encodedHeader}.${encodedPayload}`).digest('base64');

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

const extractClaims = token => {
    if (token) {
        const encodedPayload = token.split('.')[1];
        if (encodedPayload) {
            return decodeBase64(encodedPayload);
        }
    }
    return null;
};

const verifyToken = token => {
    const badRequestError = {status: 401, message: 'Token is not valid'};
    if (!token) {
        throw badRequestError;
    }
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    const isValidToken = encodedSignature === crypto.createHmac('SHA256', jwtConfig.secretKey).update(
        `${encodedHeader}.${encodedPayload}`).digest('base64');

    if (!isValidToken) {
        throw badRequestError;
    }
    return extractClaims(token);
};

module.exports = {
    verifyToken,
    generateToken,
};
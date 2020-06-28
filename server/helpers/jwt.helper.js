const crypto = require('crypto');
const {badRequest} = require('./types/custom-error.type');
const {throwInCase} = require('./exception.helper');
const jwtConfig = require('../config/jwt.config');

const encodeToBase64 = data => Buffer.from(JSON.stringify(data)).toString('base64');
const decodeBase64 = data => JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

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
    const ex = badRequest('Token is not valid');
    throwInCase(!token, ex);

    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    const isValidToken = encodedSignature === crypto.createHmac('SHA256', jwtConfig.secretKey).update(
        `${encodedHeader}.${encodedPayload}`).digest('base64');

    throwInCase(!isValidToken, ex);

    return extractClaims(token);
};

module.exports = {
    verifyToken,
    generateToken,
};

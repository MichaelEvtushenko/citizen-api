const jwtHelper = require('../../helpers/jwt.helper');
const userQuery = require('../../data/queries/user.query');

module.exports = (roles) => {
    return async (ctx, next) => {
        const {authorization} = ctx.headers;
        ctx.assert(authorization, 401, 'Unauthorized');

        const token = authorization.split(' ')[1];
        const payload = jwtHelper.verifyToken(token);

        ctx.assert(payload.exp > Date.now(), 401, 'Token expired');
        ctx.assert(roles.includes(payload.role), 403, 'You have no permission');

        const {email} = payload;
        const entity = await userQuery.findByEmail(email);
        ctx.assert(entity.enabled, 401, 'Non-activated account');

        return next();
    }
};

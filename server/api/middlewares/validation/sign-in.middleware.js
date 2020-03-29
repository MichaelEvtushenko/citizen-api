const {isEmailValid, isPasswordValid} = require('../../../helpers/validation.helper');

module.exports = (ctx, next) => {
    const {email, password} = ctx.request.body;

    ctx.assert(isEmailValid(email), 400, 'Email is not valid');
    ctx.assert(isPasswordValid(password), 400, 'Password is not valid');

    ctx.state.credentials = {email, password};
    return next();
};

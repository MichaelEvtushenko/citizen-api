const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const minPasswordLength = 6;

const isEmailValid = email => email && emailRegexp.test(email);
const isPasswordEmail = password => password && password.length >= minPasswordLength;

module.exports = (ctx, next) => {
    const {email, password, confirmPassword, fullName} = ctx.request.body;

    // TODO: extract check to separate file. Look signIn.middleware
    ctx.assert(isEmailValid(email), 400, 'Email is not valid');
    ctx.assert(isPasswordEmail(password), 400, 'Password is not valid');
    ctx.assert(password === confirmPassword, 400, 'Confirm password is not valid');
    ctx.assert(fullName, 400, 'Fullname is not valid');

    ctx.state.user = {email, password, confirmPassword, fullName};
    return next();
};

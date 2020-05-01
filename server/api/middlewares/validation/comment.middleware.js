const {isStringValid, isIdValid} = require('../../../helpers/validation.helper');

module.exports = (ctx, next) => {
    const {description} = ctx.request.body;
    const {alertId} = ctx.params;

    ctx.assert(isStringValid(description), 400, 'Description is not valid');
    ctx.assert(isIdValid(alertId), 400, 'Alert id is not valid');

    ctx.state.comment = {description: description.trim(), alertId};
    return next();
};

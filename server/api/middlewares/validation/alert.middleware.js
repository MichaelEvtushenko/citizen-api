const {isLatitudeValid, isLongitudeValid} = require('../../../helpers/validation.helper');

module.exports = (ctx, next) => {
    const {description, latitude, longitude} = ctx.request.body;

    ctx.assert(description, 400, 'Description is not valid');
    ctx.assert(isLatitudeValid(latitude), 400, 'Latitude is not valid');
    ctx.assert(isLongitudeValid(longitude), 400, 'Longitude is not valid');

    ctx.state.alert = {description, latitude, longitude};
    return next();
};

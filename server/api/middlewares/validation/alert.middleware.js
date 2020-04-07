module.exports = (ctx, next) => {
    const {description, latitude, longitude} = ctx.request.body;

    ctx.assert(description, 400, 'Description is not valid');
    ctx.assert(Math.abs(latitude) <= 90, 400, 'Latitude is not valid');
    ctx.assert(Math.abs(longitude) <= 180, 400, 'Longitude is not valid');

    ctx.state.alert = {description, latitude, longitude};
    return next();
};

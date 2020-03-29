module.exports = async (ctx, next) => {
    // http body must be send, when it used POST, PUT or PATCH method
    const requiredMethodNames = ['POST', 'PUT', 'PATCH'];
    if (requiredMethodNames.includes(ctx.method) && !Object.keys(ctx.request.body).length) {
        ctx.throw(400, 'Http body cannot be empty');
    }
    return next();
};

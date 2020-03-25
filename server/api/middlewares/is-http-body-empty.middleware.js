module.exports = async (ctx, next) => {
    const requiredMethodNames = ['POST', 'PUT', 'PATCH'];
    if (requiredMethodNames.includes(ctx.method) && !Object.keys(ctx.request.body).length) {
        // throw {status: 400, message: 'Http body cannot be empty'};
        ctx.throw(400, 'Http body cannot be empty');
    }
    return next();
};

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        let {message} = err;
        if (ctx.status === 500 && process.env.NODE_ENV === 'production') {
            message = 'Internal Server Error';
        }
        ctx.body = {message, error: true};
        ctx.app.emit('error', err, ctx);
    }
};

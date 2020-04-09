module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;

        if (ctx.status === 500 && process.env.NODE_ENV === 'production') {
            ctx.body = 'Internal Server Error';
        }
        ctx.app.emit('error', err, ctx);
    }
};

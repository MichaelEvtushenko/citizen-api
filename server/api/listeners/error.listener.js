module.exports = app => {
    app.on('error', (err, ctx) => {
        console.error(`${ctx.method} ${ctx.url}`);
        if (Object.keys(ctx.request.body).length) {
            console.error('Body: ', ctx.request.body);
        }
        console.error('Error listening: ', err);
    });
};

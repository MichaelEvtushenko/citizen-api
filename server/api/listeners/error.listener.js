module.exports = app => {
    app.on('error', (err, ctx) => {
        console.error(`${ctx.method} ${ctx.url}`);
        if (ctx.request.body) {
            console.error('BODY: ', ctx.request.body);
        }
        console.error('Error listening: ', err);
    });
};

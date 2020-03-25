module.exports = app => {
    app.on('error', (err, ctx) => {
        console.error(`METHOD: ${ctx.method}`);
        console.error(`URL: ${ctx.url}`);
        console.error('BODY: ', ctx.request.body);
        console.error('Error listening: ', err);
    });
};

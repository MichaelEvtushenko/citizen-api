const created = (ctx, uri) => {
    const hostName = process.env.HOST_NAME || `localhost:${process.env.PORT || 3000}`;
    ctx.set('Location', `http://${hostName}/${uri}`);
    ctx.status = 201;
};

module.exports = {
    created,
};

const Koa = require('koa');
const setupRoutes = require('./api/routes/index');
const setupMiddlewares = require('./api/middlewares/index');
const setupListeners = require('./api/listeners/error.listener');

const app = new Koa();

setupMiddlewares(app);
setupListeners(app);
setupRoutes(app);

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});

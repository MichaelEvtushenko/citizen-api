const Koa = require('koa');

const setupRoutes = require('./api/routes/index');
const setupMiddlewares = require('./api/middlewares/index');
const setupListeners = require('./api/listeners/index');
const setupSchedulers = require('./schedulers/index');
const setupSockets = require('./sockets/index');

const app = new Koa();

setupMiddlewares(app);
setupListeners(app);
setupRoutes(app);
setupSchedulers();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});

setupSockets(server);

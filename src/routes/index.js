const exampleRouter = require('./example.routes');
const authController = require('./auth.routes');

const routes = (app) => {
  app.use(`/api/examples`, exampleRouter);
  app.use(`/api/auth`, authController);
};

module.exports = routes;

const authController = require('./auth.routes');

const routes = (app) => {
  app.use(`/api/auth`, authController);
};

module.exports = routes;

/**
 *
 * Defines the routes for the application, which link HTTP requests to specific controllers
 *
 */

const exampleRouter = require('./example.routes');

const routes = (app) => {
  app.use(`/api/examples`, exampleRouter);
};

module.exports = routes;

/**
 *
 * Houses the controller functions that handle incoming HTTP requests and responses
 *
 */

const { create, findAll, findOne, update, remove } = require('../services/example.service');

const exampleController = {
  // [POST] /api/examples
  create: async (req, res, next) => {
    try {
      await create(data);
    } catch (error) {
      next(error);
    }
  },

  // [GET] /api/examples
  findAll: async (req, res, next) => {
    try {
      await findAll();
    } catch (error) {
      next(error);
    }
  },

  // [GET] /api/examples/:id
  findOne: async (req, res, next) => {
    try {
      await findOne(id);
    } catch (error) {
      next(error);
    }
  },

  // [PATCH] /api/examples/:id
  update: async (req, res, next) => {
    try {
      await update(id, data);
    } catch (error) {
      next(error);
    }
  },

  // [DELETE] /api/examples/:id
  remove: async (req, res, next) => {
    try {
      await remove(id);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = exampleController;

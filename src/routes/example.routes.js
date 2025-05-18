/**
 *
 * Defines the routes for the application, which link HTTP requests to specific controllers
 *
 */

const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example.controller');

router.post('/', exampleController.create);
router.get('/', exampleController.findAll);
router.get('/:id', exampleController.findOne);
router.patch('/:id', exampleController.update);
router.delete('/:id', exampleController.remove);

module.exports = router;

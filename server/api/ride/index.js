'use strict';

var express = require('express');
var controller = require('./ride.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/fewestStops/:start/:end', controller.fewestStops);	
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

//GETS
router.get('/', controller.index);
//router.get('/:id', controller.show);
router.get('/getTrainTimeTables', controller.returnTrains);		//I ADDED THIS

//POSTS
router.post('/', controller.create);

//PUTS
router.put('/:id', controller.update);

//PATCHES
router.patch('/:id', controller.update);

//DELETES
router.delete('/:id', controller.destroy);

module.exports = router;

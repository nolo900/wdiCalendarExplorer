var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

/* GET home page. */
router.get('/', function(req, res, next) {
  controller.homePage(req, res);
});

module.exports = router;

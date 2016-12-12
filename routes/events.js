var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

/* GET /events page. */
router.get('/', function(req, res, next) {
	res.send("show my events now!");
});

module.exports = router;
let express = require('express');
let router = express.Router();
let controller = require('../controllers/main');

// GET Login page //
router.get('/', function (req, res, next) {
	controller.loginPage(req,res);
});

module.exports = router;
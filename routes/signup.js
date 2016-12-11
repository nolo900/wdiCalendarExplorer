let express = require('express');
let router = express.Router();
let controller = require('../controllers/main');

// GET Signup page //
router.get('/', function (req, res, next) {
	controller.signupPage(req,res);
});

module.exports = router;
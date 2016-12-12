let express = require('express');
let router = express.Router();
let controller = require('../controllers/main');

// GET Signup page //
router.get('/', function (req, res, next) {
	controller.signupPage(req,res);
});

// POST to Signup page
router.post('/', function (req, res, next) {
	controller.signupUser(req,res,next);
})

module.exports = router;
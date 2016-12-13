var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

function authenticate(req,res,next) {
	if(!req.isAuthenticated()) {
		req.flash('error', 'Please signup or login.');
		res.redirect('/login');
	} else {
		next();
	}
};

/* GET /events page. */
router.get('/', authenticate, function(req, res, next) {
	controller.showEvents(req,res,next);
});

module.exports = router;
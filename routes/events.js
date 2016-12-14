var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

/* GET /events page. */
router.get('/', authenticate, function(req, res, next) {
	controller.showEvents(req,res,next);
});

router.post('/:id', authenticate, function (req, res, next) {
	controller.saveEvent(req,res,next);
});

router.delete('/:id', authenticate, function (req, res, next) {
	console.log('A. about to delete favorite with id:', req.params.id);
	controller.deleteFavoriteEvent(req,res,next);
})

module.exports = router;


////////////////////////////////////////////////////////////

function makeError(res, message, status) {
	res.statusCode = status;
	var error = new Error(message);
	error.status = status;
	return error;
}

function authenticate(req, res, next) {
	if(!req.isAuthenticated()) {
		req.flash('error', 'Please signup or login.');
		res.redirect('/login');
	}
	else {
		next();
	}
}
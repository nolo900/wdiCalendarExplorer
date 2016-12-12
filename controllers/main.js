var passport = require('passport');
var controller = {};

controller.homePage = function(req,res){
	res.render('index', {
		headTitle: "WDI Event Saver",
		title: 'Find all those github lesson links!',
		subTitle: "No more digging through slack for hours..."
	});
};

controller.loginPage = function (req, res) {
	res.render('./partials/accessForms/login', {
		message: req.flash()
	});
};

controller.loginUser = function (req, res, next) {
	var loginStrategy = passport.authenticate('local-login', {
		successRedirect : '/events',
		failureRedirect : '/login',
		failureFlash: true
	});

	return loginStrategy(req,res,next);
}

controller.signupPage = function (req, res) {
	res.render('./partials/accessForms/signup', {})
};

controller.signupUser = function (req, res, next) {
	var signUpStrategy = passport.authenticate('local-signup', {
		successRedirect: '/events',
		failureRedirect : '/signup',
		failureFlash : true
	});

	return signUpStrategy(req,res,next);
};

module.exports = controller;


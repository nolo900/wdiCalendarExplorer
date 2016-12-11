var controller = {};

controller.homePage = function(req,res){
	res.render('index', {
		headTitle: "WDI Event Saver",
		title: 'Find all those github lesson links!',
		subTitle: "No more digging through slack for hours..."
	});
};

controller.loginPage = function (req, res) {
	res.render('./partials/accessForms/login', {});
};

controller.signupPage = function (req, res) {
	res.render('./partials/accessForms/signup', {})
};

module.exports = controller;


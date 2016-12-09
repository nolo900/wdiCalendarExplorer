var controller = {};

controller.homePage = function(req,res){
	console.log(req.cookies);
	res.render('index', {
		headTitle: "WDI Event Saver",
		title: 'WDI Calendar Event Saver',
		subTitle: "Store your favorite WDI Info!"
	});
};




module.exports = controller;


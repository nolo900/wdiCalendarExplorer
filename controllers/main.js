var passport = require('passport');
var mongoose = require('mongoose');
var Event = require('../models/eventModel');
var Favorite = require('../models/favoriteEventsModel');

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

controller.showEvents = function (req, res, next){
	Event.find({}).sort({'dateTime': 1})
		.then(function (foundEvents) {
			res.render('./partials/eventsSelector', {
				Events: foundEvents,
				message: req.flash()
			});
		})
		.catch(function (err) {
			next(err);
		});
};

controller.showUserEvents = function (req, res, next) {

	Favorite.find({user: global.currentUser.id}).populate("event")
		.then(function (foundFavorites) {
			res.render('./partials/usersEvents', {
				Favorites: foundFavorites,
				message: req.flash()
			});
		})
		.catch(function (err) {
			next(err);
		})

};

controller.saveEvent = function (req, res, next) {
	//  Only add if favorite doesn't already exist
	Favorite.find({user: currentUser.id,event: req.params.id})
		.then(function (foundEvent) {

			if (foundEvent.length > 0) {
				req.flash('info', 'Event already added...');
				res.redirect('/events');
			} else {

				let fav = new Favorite({
					user: currentUser.id,
					event: req.params.id,
				});

				fav.save()
					.then(function (saved) {
						//req.flash('success', 'Event added to favorites!');
						//res.redirect('/events');
						res.redirect('/users');
					})
					.catch(function (err) {
						next(err);
					});
			}

		})
		.catch(function (err) {
			next(err);
		})
};

controller.deleteFavoriteEvent = function (req,res,next){
	Favorite.remove({_id: req.params.id})
		.then(function (foundFavorite) {
			res.redirect('/users');
		})
		.catch(function (err) {
			next(err);
		});
};

module.exports = controller;


(function() {
	"use strict";
	var fs = require('fs');
	var readline = require('readline');
	var google = require('googleapis');
	var path = require('path');
	var googleAuth = require('google-auth-library');
	var calID = "generalassemb.ly_003glv5s4t3ak7p01s6s62pcj4@group.calendar.google.com";

	var mongoose = require('mongoose');
	var Event = require('../models/eventModel');

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-nodejs-quickstart.json
	var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
	var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
		process.env.USERPROFILE) + '/.credentials/';
	var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';


	let GoogleCalendarImporter = {

		importEvents: function() {

			if (process.env.GCAL_CLIENT_SECRET){
				this.authorize(JSON.parse(process.env.GCAL_CLIENT_SECRET), this.pushGCalEventsToDB);
			} else {
				//Load client secrets from a local file.
				fs.readFile('client_secret.json', (err, content) => {
					if (err) {
						console.log('Error loading local client secret file: ' + err);
						return;
					}
					// Authorize a client with the loaded credentials, then call the
					// Google Calendar API.

					//this.authorize(JSON.parse(content), this.listEvents);
					//this.authorize(JSON.parse(content), this.updateCalendarEvent);
					this.authorize(JSON.parse(content), this.pushGCalEventsToDB);
				})
			}

		},

		/**
		 * Create an OAuth2 client with the given credentials, and then execute the
		 * given callback function.
		 *
		 * @param {Object} credentials The authorization client credentials.
		 * @param {function} callback The callback to call with the authorized client.
		 */
		authorize: function(credentials, callback) {
			var clientSecret = credentials.installed.client_secret;
			var clientId = credentials.installed.client_id;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

			// Check if we have previously stored a token.
			if (process.env.GCAL_TOKEN) {
				oauth2Client.credentials = JSON.parse(process.env.GCAL_TOKEN);
				callback(oauth2Client);
			}
			else {
				fs.readFile(TOKEN_PATH, (err, token) => {

					if (err) {
						this.getNewToken(oauth2Client, callback);
					} else {
						oauth2Client.credentials = JSON.parse(token);
						callback(oauth2Client);
					}
				});
			}
	    },

		/**
		 * Get and store new token after prompting for user authorization, and then
		 * execute the given callback with the authorized OAuth2 client.
		 *
		 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
		 * @param {getEventsCallback} callback The callback to call with the authorized
		 *     client.
		 */
		getNewToken: function(oauth2Client, callback) {
			var authUrl = oauth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: SCOPES
			});
			console.log('Authorize this app by visiting this url: ', authUrl);
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			rl.question('Enter the code from that page here: ', (code) => {
				rl.close();
				oauth2Client.getToken(code, (err, token) => {
					if (err) {
						console.log('Error while trying to retrieve access token', err);
						return;
					}
					oauth2Client.credentials = token;
					this.storeToken(token);
					callback(oauth2Client);
				});
			});
		},

		/**
		 * Store token to disk be used in later program executions.
		 *
		 * @param {Object} token The token to store to disk.
		 */
		storeToken: function(token) {
			try {
				fs.mkdirSync(TOKEN_DIR);
			} catch (err) {
				if (err.code != 'EEXIST') {
					throw err;
				}
			}
			fs.writeFile(TOKEN_PATH, JSON.stringify(token));
			console.log('Token stored to ' + TOKEN_PATH);
		},

		/**
		 * Lists the next 10 events on the user's primary calendar.
		 *
		 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
		 */
		listEvents: function(auth) {
			var calendar = google.calendar('v3');
			calendar.events.list({
				auth: auth,
				calendarId: calID,
				//timeMin: (new Date()).toISOString(),
				timeMin: '2016-10-31T00:00:00-05:00',
				timeMax: '2017-03-01T00:00:00-05:00',
				// maxResults: 100,
				singleEvents: true,
				orderBy: 'startTime'
			}, (err, response) => {
				if (err) {
					console.log('The API returned an error: ' + err);
					return;
				}
				var events = response.items;
				if (events.length == 0) {
					console.log('No upcoming events found.');
				} else {
					console.log('Found Events:');
					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var start = event.start.dateTime || event.start.date;
						console.log('%s - %s - %s',
									start,
									event.summary,
									event.description,
									event.id
						);
					}
				}
			});
		},

		pushGCalEventsToDB: function(auth){
			var that = this;
			var calendar = google.calendar('v3');

			calendar.events.list({
				auth: auth,
				calendarId: calID,
				//timeMin: (new Date()).toISOString(),
				timeMin: '2016-10-31T00:00:00-05:00',
				timeMax: '2017-03-01T00:00:00-05:00',
				// maxResults: 100,
				singleEvents: true,
				orderBy: 'startTime'
			}, (err, response) => {
				if (err) {
					console.log('Can\'t push events to DB, The API returned an error: ' + err);
					return;
				}
				var events = response.items;
				if (events.length == 0) {
					console.log('Can\'t push events to DB, No upcoming events found.');
				} else {
					events.forEach(function (event) {
						//add to DB
						//if event has a desc that contains a link then save it in the database
						// check event ID and only append if it doesn't already exist

						Event.findOne({gCalEventId: event.id})
							.then(function (foundEvent) {

								if (foundEvent === null &&
									event.description &&
									event.description.match(/(([htps]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g)
									) {
									console.log('Saving: ', event.id);
									var links = event.description.match(/(([htps]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g);

									var dbCalEvent = new Event({
										gCalEventId: event.id,
										title: event.summary,
										dateTime: event.start.dateTime || event.start.date,
										description: event.description,
										eventLink: event.htmlLink,
										extractedlinks: links
									});

									dbCalEvent.save();
								}

							})
							.catch(function (err) {
								console.log("Error during checking if event already exists...", err.message);
							});


					});

					// ----- OLD CODE THAT WIPES COLLECTION AND BUILDS FROM SCRATCH ---------------
					// Event.remove({},function(){
					// 	console.log("All Events Deleted...");
					//
					// 	console.log('Saving Events in DB...');
					// 	for (var i = 0; i < events.length; i++) {
					// 		var event = events[i];
					// 		//if event has a desc that contains a link then save it in the database
					// 		console.log('Saving: ', i, event.id);
					//
					// 		if(event.description && event.description.match(/(([htps]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g)){
					// 			console.log('Saving: ', i, event.id);
					// 			var links = event.description.match(/(([htps]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g);
					//
					// 			var dbCalEvent = new Event({
					// 				gCalEventId: event.id,
					// 				title: event.summary,
					// 				dateTime: event.start.dateTime || event.start.date,
					// 				description: event.description,
					// 				eventLink: event.htmlLink,
					// 				extractedlinks: links
					// 			});
					//
					// 			dbCalEvent.save();
					// 		}
					//
					// 	}
					//
					// });

				}
			});
		}

	}


// function updateCalendarEvent(auth){
// 	var calendar = google.calendar('v3');
// 	calendar.events.patch({
// 		auth: auth,
// 		calendarId: calID,
// 		eventId: eventID,
// 		resource:{
// 			summary: newTitle,
// 			start: {
// 				dateTime: "2016-12-07T19:30:00-05:00"
// 			},
// 			end: {
// 				//dateTime: "2016-12-07T20:30:00-05:00"
// 				dateTime: new Date(Date.now()).toISOString()
// 			}
// 		}
//
// 	}, function (err, response) {
// 		console.log("MODIFIED EVENT OBJECT: ",response);
// 		if (err){
// 			console.log("The API returned an error: " + err);
// 		} else {
// 			console.log("Event updated successfully. New Title: \"" + response.summary + "\"");
// 		}
// 	});
// }

	module.exports = GoogleCalendarImporter;
})();

/* To use this code:

  let importer = require('./controllers/gCalImporter');

  let scheduler = ....

  scheduler.schedule('* * 30 * * *', function() {
    importer.importEvents();
  });

 */
(function() {
	"use strict";
	var fs = require('fs');
	var readline = require('readline');
	var google = require('googleapis');
	var googleAuth = require('google-auth-library');
	// var newTitle = process.argv[3];
	// var eventID = process.argv[2];
	var calID = "generalassemb.ly_003glv5s4t3ak7p01s6s62pcj4@group.calendar.google.com";

	// If modifying these scopes, delete your previously saved credentials
	// at ~/.credentials/calendar-nodejs-quickstart.json
	var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
	var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
		process.env.USERPROFILE) + '/.credentials/';
	var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

	let GoogleCalendarImporter = {

		importEvents: function() {
			// Load client secrets from a local file.
			fs.readFile('client_secret.json', function processClientSecrets(err, content) {
				if (err) {
					console.log('Error loading client secret file: ' + err);
					return;
				}
				// Authorize a client with the loaded credentials, then call the
				// Google Calendar API.
				this.authorize(JSON.parse(content), this.listEvents);
				// this.authorize(JSON.parse(content), updateCalendarEvent);
			})
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
			fs.readFile(TOKEN_PATH, function (err, token) {

				if (err) {
					this.getNewToken(oauth2Client, callback);
				} else {
					oauth2Client.credentials = JSON.parse(token);
					callback(oauth2Client);
				}
			});
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
			rl.question('Enter the code from that page here: ', function (code) {
				rl.close();
				oauth2Client.getToken(code, function (err, token) {
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
				timeMin: (new Date()).toISOString(),
				maxResults: 10,
				singleEvents: true,
				orderBy: 'startTime'
			}, function (err, response) {
				if (err) {
					console.log('The API returned an error: ' + err);
					return;
				}
				var events = response.items;
				if (events.length == 0) {
					console.log('No upcoming events found.');
				} else {
					console.log('Upcoming 10 events:');
					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var start = event.start.dateTime || event.start.date;
						console.log('%s - %s', start, event.summary);
					}
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
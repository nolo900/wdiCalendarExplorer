const mongoose = require('mongoose');
const Event = require('./eventModel');
const User = require('./userModel');

let Schema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
	comment: { type: String }
},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Favorite',Schema);
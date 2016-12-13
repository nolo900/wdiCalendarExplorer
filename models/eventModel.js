const mongoose = require('mongoose');

let EventSchema = new mongoose.Schema({
	//gCalEventId:  String,
	gCalEventId: {type: String, required: true},
	title: String,
	dateTime: Date,
	description: String,
	eventLink: String,
	extractedlinks: {type: Array}

	//user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{
	timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
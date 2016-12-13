const mongoose = require('mongoose');

let EventSchema = new mongoose.Schema({
	gCalEventId: {type: String, required:true},
	title: {type: String, required: true},
	dateTime: { type: Date, required: true},
	description: { type: String },
	eventLink: {type: String},
	extractedlinks: {type: Array}

	//user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{
	timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
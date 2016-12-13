const mongoose = require('mongoose');

let SavedEventSchema = new mongoose.Schema({
	title: {type: String, required: true},
	dateTime: { type: Date, required: true},
	comment: {type: String},
	links: {type: Array},

	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{
	timestamps: true
});

module.exports = mongoose.model('SavedEvent', SavedEventSchema);
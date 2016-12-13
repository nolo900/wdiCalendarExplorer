const mongoose = require('mongoose');

let FavoriteEventSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},

	comment: { type: String }
},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('')
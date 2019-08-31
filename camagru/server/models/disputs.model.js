const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disputSchema = new Schema({
	text: String,
	author: {
		nickname: String,
		id: String
	},
	likes: Number,
	masterPieceID: String
},{timestamps: true});

module.exports = mongoose.model('disputs', disputSchema);
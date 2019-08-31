const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const masterPieceSchema = new Schema({
	userID: String,
	imagePath: String,
	likes: Number
}, { timestamps: true});

module.exports = mongoose.model('masterpiece', masterPieceSchema);
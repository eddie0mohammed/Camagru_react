const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userID: String,
	accessToken: String
});

module.exports = mongoose.model('tokens', tokenSchema);
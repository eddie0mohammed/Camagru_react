const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const masterpieces = require('../models/masterpieces.model');

const checkToken = (req, res, next) => {
	let token = req.headers['x-access-token'] || req.headers['authorization'];
	if (token) {
		if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
		jwt.verify(token, keys.JWTsecret, (err, decoded) => {
			if (err) return res.json({success: false, message: 'token is not valid', err})
			else {
				res.locals.decoded = decoded;
				next();
			}
		});
	} else return res.json({success: false, message: 'Auth token is not supplied'});
}

const deletePermisionCheck = async (req, res, next) => {
	console.log('res.locals = ', res.locals);
	console.log('res.locals.decoded = ', res.locals.decoded);
	const {pictureID} = req.body;
	
	if (!pictureID) return res.json({success: false, err: "no input provided"});

	const masterpiece  = await masterpieces.findById(pictureID);
	if (masterpiece.userID == res.locals.decoded.id)
		next();
	else return res.json({success: false, err: "No permisson to delete the photo"});
}



module.exports = {
	checkToken,
	deletePermisionCheck
}

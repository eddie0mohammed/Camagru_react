const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const users = require('../models/users.model');
const tokens = require('../models/tokens.model');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const {checkToken} = require('../middleware/middleware');
const sendEmail = require('../email');

router.get('/checkAuth', checkToken, (req, res) => {
	return res.json({success: true});
})

router.get('/confirm/:token', (req, res) => {
	const {token} = req.params;
	if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
	jwt.verify(token, keys.JWTsecret, async (err, decoded) => {
		const {email} = decoded;
		const user = await users.findOne({email});
		user.confirmEmail = true;
		user.save().then(() => res.redirect('http://localhost:3000/main'));
	});
})

router.post('/login', async (req, res) => {
	const {email, password} = req.body;
	const user = await users.findOne({email});
	if (!user || !user.confirmEmail) return res.sendStatus(403).json({success: false, message: 'incorect username or password'});
	const {nickname, id}  = await user;
	const match = await bcrypt.compare(password, user.password);
	if (match && email === user.email) {
		// generate new accessToken, save it to db, send it back to user
		const token = jwt.sign({email, nickname, id}, keys.JWTsecret, { expiresIn: '24h'});

		// if such user has token replace it otherwise create a new one: 
		const userToken = await tokens.findOne({userID: id});
		if (userToken) {
			userToken.accessToken = token;
			return userToken.save().then(() => res.json({success: true, accessToken: token}));			
		} else {
			const newToken = new tokens({userID: id, accessToken: token});
			return newToken.save().then(() => res.json({success: true, accessToken: token}));
		}
	}
	 return res.sendStatus(403).json({success: false, message: 'Incorect username or password'});
});


router.post('/reg', (req, res) => {
	const {email, password, nickname} = req.body;

	//check for errors in email, pass...
	if (!email || !password || !nickname) return res.json({err: 'wrong input', data: req.body});

	// console.log('problem');

	bcrypt.hash(password, saltRounds,  (err, hash)  => {
		if (err) return res.json({success: false, err})
		const newUser = new users({email, password: hash, nickname, confirmEmail: false, sendNotification: true});
		const token = jwt.sign({email}, keys.JWTsecret, { expiresIn: '1h'});
		sendEmail(email, token, "newUser");
		newUser.save().then((user) => res.json({success:true}));
	})
})

router.post('/forgot-password',  async (req, res) => {
	const { email, password } = req.body;
	if (!email) return res.json({success: false, err: 'No email recevied'});
	const token = jwt.sign({email}, keys.JWTsecret, { expiresIn: '1h'});
	sendEmail(email, token, "forgotPassword")
	return res.json({success: true});
});

router.post('/forgot-password/:token', (req, res) => {
	const {token} = req.params;
	const {password} = req.body;
	if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
	jwt.verify(token, keys.JWTsecret, async (err, decoded) => {
		const {email} = decoded;
		const user = await users.findOne({email});
		if (!user) return res.json({success: false, err: "no such user exist in database"});
		bcrypt.hash(password, saltRounds, (err, hash) => {
			if (err) return res.json({success: false, err});
			user.password = hash;
			user.save().then(() => res.json({success: true}));
		});	
	});
});



module.exports = router;
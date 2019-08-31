const express = require('express');
const router = express.Router();
const fs = require('fs');
const users = require('../models/users.model');
const masterPieces = require('../models/masterpieces.model');
const disputs = require('../models/disputs.model');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sendEmail = require('../email');
const {deletePermisionCheck} = require('../middleware/middleware');

router.get('/user', (req, res) => {
	const {decoded: {email}} = res.locals;	
	let nickname = "unknown";
	users.findOne({email}, (err, doc) => {
		let success = false;
		if (!err) {
			
			success = true;
			nickname = doc.nickname;
		}
		return res.json({success, data: {nickname}});
	});
})

router.get('/gallery', (req, res) => {
	const {id} = res.locals.decoded;
	masterPieces.find({}, (err, docs) => {
		if (err) return res.json({success: false, err});

		const userGallery = docs.map((cur) => {
			if(cur.userID === id)
				return ({...cur, owned: "true"})
			return ({...cur, owned: "false"})
		});
		return res.json({success: true, data: userGallery})
	})
})

router.get('/comments/:id', (req, res) => {
	const {id} = req.params;

	disputs.find({masterPieceID: id}, (err, docs) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: docs});
	})
} )

router.post('/add-comment/:id', async (req, res)=> {
	const {id} = req.params;
	const {text} = req.body;
	const {nickname, id:userID} = res.locals.decoded;
	const newDisput = new disputs({text, author:{nickname, id: userID}, likes: 0, masterPieceID:id});
	newDisput.save().then(disput => res.json({success: true, data:disput}));
	const masterpiece = await masterPieces.findById(id);
	const authorID = masterpiece.userID;
	const user = await users.findById(authorID);
	console.log('this is the author of picture ', user);
	if (user.sendNotification) {
		sendEmail(user.email, `http://localhost:3000/picture/${id}`, "newComment");
	}
})

router.get('/picture/:id', (req, res) => {
	const {id} = req.params;

	if (!id) return res.json({success: false, err: "No such picture in database"});
	masterPieces.findById(id, (err, doc) => {
		if (err) return res.json({success: false, err});

		disputs.find({masterPieceID: id}, (err, docs) => {
			return res.json({success: true, data: {image: doc, comments: docs}});
		})
	})
})

router.get('/picture/:id/can-delete', (req, res) => {
	const {id} = res.locals.decoded;
	const {id: pictureID} = req.params;
	masterPieces.findById(pictureID, (err, doc) => {
		if (err) return res.json({success: false, err});
		return res.json({success:true});
	})
})


router.get('/like/:id', async (req, res) => {
	const {id} = req.params;
	const disput = await disputs.findById(id);
	disput.likes += 1;
	disput.save().then(() => res.json({success: true}));
})

router.post('/addPicture',  (req, res) => {	
	const {nickname, id} = res.locals.decoded;
	const base64Data = req.body.base64.replace(/^data:image\/png;base64,/, "");
	const filePath = `uploads/${nickname}-${new Date().getTime()}.png`
	fs.writeFile(filePath, base64Data, 'base64', function(err) {
		if(err){
		   console.log(err);
		 }
	});
	const newMasterPiece = new masterPieces({userID: id, imagePath: filePath});
	newMasterPiece.save().then(piece => res.json({success: true, masterpiece: piece}));
})

router.delete('/deletePicture',deletePermisionCheck, async (req, res) => {
	const {pictureID} = req.body;
	masterPieces.findByIdAndDelete(pictureID, (err, doc) => {
		if (err) return res.json({success: false, err});
		return res.json({success: true, data: doc});
	});	
})


router.post('/editProfile', async (req, res) => {
	const {email: userEmail} = res.locals.decoded;
	const {email, nickname, password, sendNotification} = req.body;

	const user = await users.findOne({email: userEmail});
	if (nickname) {
		user.nickname = nickname
	}

	if (email) {
		user.email = email
		user.confirmEmail = false;
		const token = jwt.sign({email}, keys.JWTsecret, { expiresIn: '1h'});
		sendEmail(email, token, "newUser");
	}

	if (password) {
		bcrypt.hash(password, saltRounds,  (err, hash)  => {
			if (err) return res.json({success: false, err})
			user.password = hash;
			user.save();
		})
	}
	if (sendNotification !== user.sendNotification)
		user.sendNotification = sendNotification;
	
	user.save().then(() => res.json({success: true}));

})



module.exports = router;

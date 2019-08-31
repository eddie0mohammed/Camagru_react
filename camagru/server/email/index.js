const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const send = (adressant, token, cmd) => {

	const cmds = {
		newUser: `http://localhost:6357/auth/confirm/${token}`,
		forgotPassword: `http://localhost:3000/changePass/${token}`,
		newComment: `You have new comment on your picture\n find it here: ${token}`
	}

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'johnvolt32@gmail.com',
			pass: 'badPassword1'
		}
	});

	const mailOptions = {
		from: 'johnvolt32@gmail.com',
		to: adressant,
		subject: 'confirm camagru action',
		text: cmds[cmd]
	}

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
			return {success: false, error};
		} else {
			console.log('Email sent: ' + info.response);
			return {success:true}; 
		}
	  });
}

module.exports = send;
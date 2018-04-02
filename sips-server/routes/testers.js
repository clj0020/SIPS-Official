const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Tester = require('../models/tester');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport("smtps://" + config.GMAIL_USERNAME + "%40gmail.com:" + encodeURIComponent(config.GMAIL_PASS) + "@smtp.gmail.com:465");

// var smtpTransport = nodemailer.createTransport("SMTP", {
// 	service: "Gmail",
// 	auth: {
// 		user: config.GMAIL_USERNAME,
// 		pass: config.GMAIL_PASS
// 	}
// });
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

var requireAuth = passport.authenticate('jwt', {
	session: false
});

var requireLogin = passport.authenticate('local', {
	session: false
});

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080
	});
}

function setTesterInfo(request) {
	return {
		_id: request._id,
		first_name: request.first_name,
		last_name: request.last_name,
		email: request.email,
		organization: request.organization
	};
}

function setUnVerifiedTesterInfo(request) {
	return {
		_id: request._id,
		email: request.email,
		organization: request.organization
	};
}

// Register
router.post('/register', (req, res, next) => {
	let newTester = new Tester({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		organization: req.body.organization
	});

	Tester.findOne({
		email: req.body.email
	}, (err, existingTester) => {
		if (err) {
			return next(err);
		}
		if (existingTester) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		Tester.addUser(newTester, (err, tester) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to register tester!' + err.message
				});
			} else {
				testerInfo = setTesterInfo(tester);

				res.status(200).json({
					success: true,
					msg: 'User registered!',
					token: 'JWT ' + generateToken(testerInfo),
					user: testerInfo
				});
			}
		});
	});
});

router.post('/add', requireAuth, auth.roleAuthorization(['Admin']), (req, res, next) => {
	let newTester = new Tester({
		email: req.body.email,
		organization: req.body.organization
	});

	Tester.findOne({
		email: req.body.email
	}, (err, existingTester) => {
		if (err) {
			return next(err);
		}
		if (existingTester) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		Tester.addUser(newTester, (err, tester) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to register tester!' + err.message
				});
			} else {
				testerInfo = setUnVerifiedTesterInfo(tester);

				res.status(200).json({
					success: true,
					msg: 'Tester registered!',
					tester: testerInfo
				});
			}
		});
	});
});

router.get('/send-confirmation', function(req, res) {
	rand = Math.floor((Math.random() * 100) + 54);
	host = req.get('host');
	link = "http://" + req.get('host') + "/testers/verify?id=" + rand;
	mailOptions = {
		to: req.query.to,
		subject: "Please confirm your Email account",
		html: "Hello from SIPS!<br> You've been added as a tester, Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			res.status(401).json({
				success: false,
				msg: 'Failed to send tester email!' + error.message
			});
		} else {
			res.status(200).json({
				success: true,
				msg: 'Sent email!'
			});
		}
	});
});

router.get('/verify', function(req, res) {
	console.log(req.protocol + ":/" + req.get('host'));
	if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
		console.log("Domain is matched. Information is from Authentic email");
		if (req.query.id == rand) {
			res.end("<h1>" + mailOptions.to + " has been successfully verified! You are now a tester!");
		} else {
			res.end("<h1>Bad Request</h1>");
		}
	} else {
		res.end("<h1>Request is from unknown source");
	}
});

module.exports = router;
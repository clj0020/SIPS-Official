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
		kind: request.kind,
		organization: request.organization,
		status: request.status,
		created_at: request.created_at
	};
}

function setUnVerifiedTesterInfo(request) {
	return {
		_id: request._id,
		email: request.email,
		kind: request.kind,
		organization: request.organization,
		status: request.status,
		created_at: request.created_at
	};
}

router.post('/add', requireAuth, auth.roleAuthorization(['Admin'], 'addTester'), (req, res, next) => {
	let newTester = new Tester({
		email: req.body.email,
		organization: req.body.organization,
		status: 'Unverified'
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
					msg: 'Failed to register tester! Error:' + err.message
				});
			} else {
				testerInfo = setUnVerifiedTesterInfo(tester);
				let token = generateToken(testerInfo);
				// Send Email
				host = req.get('host');
				link = config.WebHost + "/testers/verify?token=" + token;

				mailOptions = {
					to: testerInfo.email,
					subject: "Please confirm your Email account",
					html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as a tester, Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
				}
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						res.status(401).json({
							success: false,
							msg: 'Failed to send tester email! Error:' + error.message
						});
					} else {
						res.status(200).json({
							success: true,
							msg: 'Tester registered and confirmation email sent!',
							tester: testerInfo
						});
					}
				});
			}
		});
	});
});

router.post('/verify', function(req, res) {
	var decodedToken = {}

	// get object from token
	jwt.verify(req.headers.authorization, config.secret, function(err, decoded) {
		decodedToken = decoded;
	});

	const tester = {
		_id: decodedToken._id,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: decodedToken.email,
		kind: 'Tester',
		status: 'Verified',
		organization: decodedToken.organization,
		password: req.body.password
	};

	Tester.verifyTester(tester, (err, newTester) => {
		if (err) {
			res.status(401).json({
				success: false,
				msg: 'Failed to verify tester! Error:' + err.message
			});
		} else {

			let testerInfo = setTesterInfo(newTester);

			res.status(200).json({
				success: true,
				msg: 'Tester registered and confirmation email sent!',
				tester: testerInfo,
				token: 'JWT ' + generateToken(testerInfo)
			});
		}
	});


	//
	// return jwt.sign(user, config.secret, {
	// 	expiresIn: 10080
	// });
	//
	//
	// if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
	// 	console.log("Domain is matched. Information is from Authentic email");
	// 	if (req.query.id == rand) {
	// 		res.end("<h1>" + mailOptions.to + " has been successfully verified! You are now a tester!");
	// 	} else {
	// 		res.end("<h1>Bad Request</h1>");
	// 	}
	// } else {
	// 	res.end("<h1>Request is from unknown source");
	// }
});

// Get list of testers from Organization
router.get('/organization', requireAuth, auth.roleAuthorization(['Admin'], 'getTestersFromOrganization'), (req, res, next) => {
	let organizationId = req.user.organization;
	console.log("Getting testers from Organization..");
	console.log(organizationId);
	// Call the getTestersFromOrganization method of Tester model.
	Tester.getTestersFromOrganization(organizationId, (err, testers) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to retrieve testers: ' + err
			});
		} else {
			// Success! Send back testers
			res.status(200).json({
				success: true,
				msg: 'Got your testers.',
				testers: testers
			});
		}
	});
});


module.exports = router;
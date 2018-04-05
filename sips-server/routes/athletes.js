const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Athlete = require('../models/athlete');
const Organization = require('../models/organization');
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

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080
	});
}

function setAthleteInfo(request) {
	return {
		_id: request._id,
		status: request.status,
		kind: request.kind,
		first_name: request.first_name,
		last_name: request.last_name,
		email: request.email,
		date_of_birth: request.date_of_birth,
		height: request.height,
		weight: request.weight,
		organization: request.organization
	};
}

function setUnVerifiedAthleteInfo(request) {
	return {
		_id: request._id,
		status: request.status,
		email: request.email,
		kind: request.kind,
		organization: request.organization,
		created_at: request.created_at
	};
}

router.post('/add', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	let newAthlete = new Athlete({
		email: req.body.email,
		organization: req.body.organization,
		status: 'Unverified'
	});

	Athlete.findOne({
		email: req.body.email
	}, (err, existingAthlete) => {
		if (err) {
			return next(err);
		}
		if (existingAthlete) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		Athlete.addAthlete(newAthlete, (err, athlete) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to add athlete! Error:' + err.message
				});
			} else {
				athleteInfo = setUnVerifiedAthleteInfo(athlete);
				let token = generateToken(athleteInfo);
				// Send Email
				host = req.get('host');
				link = "http://" + config.WebHost + "/athletes/verify?token=" + token;

				mailOptions = {
					to: athleteInfo.email,
					subject: "Please confirm your Email account",
					html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as an athlete, Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
				}
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						res.status(401).json({
							success: false,
							msg: 'Failed to send athlete email! Error:' + error.message
						});
					} else {
						res.status(200).json({
							success: true,
							msg: 'Athlete registered and confirmation email sent!',
							athlete: athleteInfo
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

	const athlete = {
		_id: decodedToken._id,
		status: 'Verified',
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: decodedToken.email,
		kind: 'Athlete',
		date_of_birth: req.body.date_of_birth,
		height: req.body.height,
		weight: req.body.weight,
		organization: decodedToken.organization,
		password: req.body.password
	};

	Athlete.verifyAthlete(athlete, (err, newAthlete) => {
		if (err) {
			res.status(401).json({
				success: false,
				msg: 'Failed to verify athlete! Error:' + err.message
			});
		} else {
			let athleteInfo = setAthleteInfo(newAthlete);

			res.status(200).json({
				success: true,
				msg: 'Athlete registered and confirmation email sent!',
				athlete: athleteInfo,
				token: 'JWT ' + generateToken(athleteInfo)
			});
		}
	});
});

// Get list of athletes from Organization
router.get('/get-athletes-from-organization', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	let organizationId = req.params.organizationId;

	// Call the getAthletesFromOrganization method of Athlete model.
	Athlete.getAthletesFromOrganization(organizationId, (err, athletes) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to retrieve athletes: ' + err
			});
		} else {
			// Success! Send back athletes
			res.status(200).json({
				success: true,
				msg: 'Got your athletes.',
				athletes: athletes
			});
		}
	});
});

// Get a single athlete
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	const id = req.params.id;

	Athlete.getAthleteById(id, (err, athlete) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find athlete.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found athlete.',
				athlete: athlete
			});
		}
	});

});


module.exports = router;
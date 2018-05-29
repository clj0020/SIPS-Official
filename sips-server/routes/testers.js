const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Tester = require('../models/tester');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER || config.SENDGRID_SENDER;
const sendGridMail = require('@sendgrid/mail');

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

				const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;
				sendGridMail.setApiKey(SENDGRID_API_KEY);
				const msg = {
					to: testerInfo.email,
					from: "clj0020@gmail.com",
					subject: 'You were invited to join the Sports Injury Prevention Screening App!',
					html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as a tester for the " + req.user.organization.title + "organization on the Sports Injury Prevention screening app! Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
				};

				sendGridMail.send(msg, (error, result) => {
					if (error) {
						//Log friendly error
						console.error(error.toString());

						//Extract error msg
						const {
							message,
							code,
							response
						} = error;

						//Extract response msg
						const {
							headers,
							body
						} = response;

						res.status(401).json({
							success: false,
							msg: 'Failed to send tester email! Error:' + error.toString()
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
});

// Get a single tester
router.get('/tester/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getTester'), (req, res, next) => {
	const id = req.params.id;

	Tester.getTesterById(id, (err, tester) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find tester.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found tester.',
				tester: tester
			});
		}
	});
});

// Get list of testers from Organization
router.get('/organization', requireAuth, auth.roleAuthorization(['Admin'], 'getTestersFromOrganization'), (req, res, next) => {
	let organizationId = req.user.organization;

	Tester.getTestersFromOrganization(organizationId, (err, testers) => {
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to retrieve testers: ' + err
			});
		} else {
			res.status(200).json({
				success: true,
				msg: 'Got your testers.',
				testers: testers
			});
		}
	});
});

router.delete('/:id', requireAuth, auth.roleAuthorization(['Admin'], 'deleteTester'), (req, res, next) => {
	const id = req.params.id;

	Tester.deleteTesterById(id, (err) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to delete tester.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully deleted tester.'
			});
		}
	});
});



module.exports = router;
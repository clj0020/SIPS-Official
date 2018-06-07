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

const multer = require('multer');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});

var gcloud = require('google-cloud');

var storage = gcloud.storage({
	projectId: config.projectId,
	keyFilename: config.keyFilename
});

var bucket = storage.bucket(config.bucketName);

var requireAuth = passport.authenticate('jwt', {
	session: false
});

var requireLogin = passport.authenticate('local', {
	session: false
});


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

router.get('/resend-verification/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'resendTesterVerification'), (req, res, next) => {
	let id = req.params.id;

	console.log("Resending verification email to tester " + id);

	Tester.getTesterById(id, (err, tester) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find tester.'
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
				subject: 'Your invitation from the SIPS application has been resent.',
				html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as tester for the " + req.user.organization.title + " organization on the Sports Injury Prevention screening app! Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
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

					res.status(201).json({
						success: false,
						msg: 'Failed to send tester email! Error:' + error.toString()
					});
				} else {
					res.status(200).json({
						success: true,
						msg: 'Tester confirmation email resent!',
						tester: testerInfo
					});
				}
			});
		}
	})

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

router.post('/upload-profile-image', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'uploadTesterProfileImage'), upload.single('profileImage'), (req, res) => {
	let id = req.body.id;

	if (req.file) {
		uploadProfileImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding tester profile image: ' + err
				});
			} else {
				Tester.findByIdAndUpdate(id, {
					'profileImageUrl': imageUrl
				}, {
					new: true
				}, (err, newTester) => {
					if (err) {
						res.json({
							success: false,
							msg: 'Failed to update tester.'
						});
					} else {
						res.json({
							success: true,
							msg: 'Successfully uploaded profile image for tester.',
							tester: newTester
						});
					}
				});
			}
		});
	} else {
		return res.status(206).json({
			success: false,
			msg: 'Error: No image file uploaded.'
		});
	}
});

router.put('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'editTester'), upload.single('profileImage'), (req, res, next) => {
	const tester = req.body;

	if (req.file) {
		uploadProfileImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding profile image: ' + err
				});
			} else {
				tester.profileImageUrl = imageUrl;

				Tester.findByIdAndUpdate(req.body.id, tester, {
					new: true
				}, (err, newTester) => {
					if (err) {
						res.json({
							success: false,
							msg: 'Failed to edit tester.'
						});
					} else {
						res.json({
							success: true,
							msg: 'Successfully edited tester.',
							tester: newTester
						});
					}
				});
			}
		})
	} else {
		Tester.findByIdAndUpdate(req.body._id, req.body, {
			new: true
		}, (err, newTester) => {
			if (err) {
				res.json({
					success: false,
					msg: 'Failed to edit tester.'
				});
			} else {
				res.json({
					success: true,
					msg: 'Successfully edited tester.',
					tester: newTester
				});
			}
		});
	}
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

function uploadProfileImage(profileImageData, callback) {
	// Generate a unique filename for this image
	var filename = '' + new Date().getTime() + "-" + Math.random();
	var file = bucket.file('testers/' + filename);
	var imageUrl = 'https://' + config.bucketName + '.storage.googleapis.com/testers/' + filename;
	var stream = file.createWriteStream();
	stream.on('error', callback);
	stream.on('finish', function() {
		// Set this file to be publicly readable
		file.makePublic(function(err) {
			if (err) return callback(err);
			callback(null, imageUrl);
		});
	});
	stream.end(profileImageData);
}

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		// expiresIn: 10080
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

module.exports = router;
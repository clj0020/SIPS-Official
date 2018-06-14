const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Athlete = require('../models/athlete');
const Injury = require('../models/injury');
const Organization = require('../models/organization');

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


// Get a single athlete
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getAthlete'), (req, res, next) => {
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

// Add athlete
router.post('/', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'addAthlete'), (req, res, next) => {
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
				link = config.WebHost + "/athletes/verify?token=" + token;

				const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;
				sendGridMail.setApiKey(SENDGRID_API_KEY);
				const msg = {
					to: athleteInfo.email,
					from: "clj0020@gmail.com",
					subject: 'You were invited to join the Sports Injury Prevention Screening App!',
					html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as an athlete for the " + req.user.organization.title + "organization on the Sports Injury Prevention screening app! Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
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
							msg: 'Failed to send athlete email! Error:' + error.toString()
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

// Update athlete
router.put('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester', 'Athlete'], 'editAthlete'), upload.single('profileImage'), (req, res, next) => {
	const athlete = req.body;

	if (req.file) {
		uploadProfileImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding profile image: ' + err
				});
			} else {
				athlete.profileImageUrl = imageUrl;

				Athlete.findByIdAndUpdate(req.body._id, athlete, {
					new: true
				}, (err, newAthlete) => {
					if (err) {
						res.json({
							success: false,
							msg: 'Failed to edit athlete.'
						});
					} else {
						console.log("New Athlete: ", newAthlete);
						res.json({
							success: true,
							msg: 'Successfully edited athlete.',
							athlete: newAthlete
						});
					}
				});
			}
		})
	} else {
		Athlete.findByIdAndUpdate(req.body._id, athlete, {
			new: true
		}, (err, newAthlete) => {
			if (err) {
				res.json({
					success: false,
					msg: 'Failed to edit athlete.'
				});
			} else {
				res.json({
					success: true,
					msg: 'Successfully edited athlete.',
					athlete: newAthlete
				});
			}
		});
	}
});

// Delete Athlete
router.delete('/:id', requireAuth, auth.roleAuthorization(['Admin'], 'deleteAthlete'), (req, res, next) => {
	const id = req.params.id;

	Athlete.deleteAthleteById(id, (err) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to delete athlete.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully deleted athlete.'
			});
		}
	});
});

// Get list of athletes from Organization
router.get('/organization/:organizationId', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getAthletesFromOrganization'), (req, res, next) => {
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

// Upload Athlete Profile Image
router.post('/upload-profile-image', requireAuth, auth.roleAuthorization(['Admin', 'Tester', 'Athlete'], 'uploadAthleteProfileImage'), upload.single('profileImage'), (req, res) => {
	let id = req.body.id;

	if (req.file) {
		uploadProfileImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding athlete profile image: ' + err
				});
			} else {
				Athlete.findByIdAndUpdate(id, {
					'profileImageUrl': imageUrl
				}, {
					new: true
				}, (err, newAthlete) => {
					if (err) {
						res.json({
							success: false,
							msg: 'Failed to update athlete.'
						});
					} else {
						res.json({
							success: true,
							msg: 'Successfully uploaded profile image for athlete.',
							athlete: newAthlete
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

// Resend Verification Email
router.get('/resend-verification/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'resendAthleteVerification'), (req, res, next) => {
	let id = req.params.id;

	console.log("Resending verification email to athlete " + id);

	Athlete.getAthleteById(id, (err, athlete) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find athlete.'
			});
		} else {
			athleteInfo = setUnVerifiedAthleteInfo(athlete);
			let token = generateToken(athleteInfo);
			// Send Email
			host = req.get('host');
			link = config.WebHost + "/athletes/verify?token=" + token;

			const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;
			sendGridMail.setApiKey(SENDGRID_API_KEY);
			const msg = {
				to: athleteInfo.email,
				from: "clj0020@gmail.com",
				subject: 'Your invitation from the SIPS application has been resent.',
				html: "<h3>Hello from SIPS!</h5><br> <h5>You've been added as an athlete for the " + req.user.organization.title + " organization on the Sports Injury Prevention screening app! Please verify your email.</h5><br><a href=" + link + ">Click here to verify</a>"
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
						msg: 'Failed to send athlete email! Error:' + error.toString()
					});
				} else {
					res.status(200).json({
						success: true,
						msg: 'Athlete confirmation email resent!',
						athlete: athleteInfo
					});
				}
			});
		}
	})

});

// Verify athlete
router.post('/verify', function(req, res) {
	var decodedToken = {}

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
		sport: req.body.sport,
		position: req.body.position,
		organization: decodedToken.organization,
		password: req.body.password
	};

	let newInjuries = [];
	for (let injury of req.body.injuries) {
		const newInjury = new Injury({
			title: injury.title,
			date_occurred: injury.date_occurred,
			athlete: decodedToken._id
		});

		newInjuries.push(newInjury);
	}

	if (!newInjuries.length == 0) {
		Injury.insertMany(newInjuries, (err, injuries) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to add injuries! Error:' + err.message
				});
			} else {
				console.log("Injuries: ", injuries);

				Athlete.verifyAthlete(athlete, (err, newAthlete) => {
					if (err) {
						res.status(401).json({
							success: false,
							msg: 'Failed to verify athlete! Error:' + err.message
						});
					} else {
						console.log("New Athlete: ", newAthlete);

						let athleteInfo = setAthleteInfo(newAthlete);

						res.status(200).json({
							success: true,
							msg: 'Athlete registered and confirmation email sent!',
							athlete: athleteInfo,
							token: 'JWT ' + generateToken(athleteInfo)
						});
					}
				});
			}
		});
	} else {
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
	}
});

function uploadProfileImage(profileImageData, callback) {
	// Generate a unique filename for this image
	var filename = '' + new Date().getTime() + "-" + Math.random();
	var file = bucket.file('athletes/' + filename);
	var imageUrl = 'https://' + config.bucketName + '.storage.googleapis.com/athletes/' + filename;
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
		sport: request.sport,
		position: request.position,
		organization: request.organization,
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

module.exports = router;
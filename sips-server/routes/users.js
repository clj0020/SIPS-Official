const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');
const Athlete = require('../models/athlete');
const Organization = require('../models/organization');

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

function setUserInfo(request) {
	return {
		_id: request._id,
		email: request.email,
		first_name: request.first_name,
		last_name: request.last_name,
		organization: request.organization
	};
}

// // Register
// router.post('/register', (req, res, next) => {
// 	let newUser = new User({
// 		name: req.body.name,
// 		email: req.body.email,
// 		password: req.body.password,
// 		role: req.body.role
// 	});
//
// 	User.findOne({
// 		email: req.body.email
// 	}, (err, existingUser) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (existingUser) {
// 			return res.status(422).json({
// 				success: false,
// 				msg: 'That email address is already in use.'
// 			});
// 		}
//
// 		User.addUser(newUser, (err, user) => {
// 			if (err) {
// 				res.status(401).json({
// 					success: false,
// 					msg: 'Failed to register user!' + err.message
// 				});
// 			} else {
// 				userInfo = setUserInfo(user);
//
// 				res.status(200).json({
// 					success: true,
// 					msg: 'User registered!',
// 					token: 'JWT ' + generateToken(userInfo),
// 					user: userInfo
// 				});
// 			}
// 		});
// 	});
// });

// Authenticate
router.post('/login', (req, res, next) => {

	if (!req.body.email) {
		return res.status(422).json({
			success: false,
			msg: "Error: No email included in request."
		});
	}

	if (!req.body.password) {
		return res.status(422).json({
			success: false,
			msg: "Error: No password included in request."
		});
	}

	passport.authenticate('local', {
		session: false
	}, function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (user) {
			userInfo = setUserInfo(user);

			// if the user is a tester, then we're gonna send them their athletes to prevent another call.
			if (user.kind == 'Tester') {
				// Call the getAthletesFromOrganization method of Athlete model.
				Athlete.getAthletesFromOrganization(user.organization._id, (err, athletes) => {
					// If theres an error, success will be false
					if (err) {
						return res.json({
							success: false,
							msg: 'Failed to retrieve athletes for tester: ' + err
						});
					} else {
						// Success! Send back athletes
						res.status(200).json({
							success: true,
							msg: 'Tester successfully logged in!',
							token: 'JWT ' + generateToken(userInfo),
							user: user,
							athletes: athletes
						});
					}
				});
			} else {
				return res.json({
					success: true,
					msg: 'User found!',
					token: 'JWT ' + generateToken(userInfo),
					user: user
				});
			}
		} else {
			return res.status(201).json({
				success: false,
				msg: info
			});
		}
	})(req, res, next);
});

// Profile
router.get('/profile', requireAuth, auth.roleAuthorization(['organization_admin', 'athlete']), (req, res, next) => {
	res.status(200).json({
		user: req.user
	});
});


module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

var requireLogin = passport.authenticate('local', {
	session: false
});

function generateToken(user) {
	return jwt.sign(user.toObject(), config.secret, {
		expiresIn: 10080
	});
}

function setUserInfo(request) {
	return {
		_id: request._id,
		email: request.email,
		role: request.role,
		name: request.name,
		username: request.username
	};
}


// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		role: req.body.role
	});

	User.findOne({
		username: req.body.username
	}, (err, existingUser) => {
		if (err) {
			return next(err);
		}
		if (existingUser) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		User.addUser(newUser, (err, user) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to register user!'
				});
			} else {
				res.status(200).json({
					success: true,
					msg: 'User registered!',
					token: 'JWT ' + generateToken(user),
					user: user
				});
			}
		});
	});
});

// Authenticate
router.post('/login', (req, res, next) => {

	if (!req.body.username) {
		return res.status(422).json({
			success: false,
			errors: {
				username: "No username included in request."
			}
		});
	}

	if (!req.body.password) {
		return res.status(422).json({
			success: false,
			errors: {
				password: "No password included in request."
			}
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
			return res.json({
				success: true,
				msg: 'User found!',
				token: generateToken(userInfo),
				user: userInfo
			});
		} else {
			return res.status(500).json({
				success: false,
				errors: info
			});
		}
	})(req, res, next);


	// const username = req.body.username;
	// const password = req.body.password;
	//
	// if (!password) {
	// 	return res.status(206).json({
	// 		success: false,
	// 		msg: "Password not included in request."
	// 	});
	// }
	// if (!username) {
	// 	return res.status(206).json({
	// 		success: false,
	// 		msg: "Username not included in request."
	// 	});
	// }
	//
	// User.getUserByUsername(username, (err, user) => {
	// 	if (err) {
	// 		return res.status(206).send(err);
	// 	}
	// 	if (!user) {
	// 		return res.status(404).json({
	// 			success: false,
	// 			msg: "User not found!"
	// 		});
	// 	}
	//
	// 	User.comparePassword(password, user.password, (err, isMatch) => {
	// 		if (err) {
	// 			return res.status(206).send(err);
	// 		}
	// 		if (isMatch) {
	// 			res.status(200).json({
	// 				success: true,
	// 				msg: "Successfully logged in!",
	// 				token: 'JWT ' + generateToken(user),
	// 				user: {
	// 					id: user._id,
	// 					name: user.name,
	// 					username: user.username,
	// 					email: user.email,
	// 					role: user.role
	// 				}
	// 			});
	// 		} else {
	// 			return res.status(400).json({
	// 				success: false,
	// 				msg: 'Wrong password!'
	// 			});
	// 		}
	// 	});
	// });
});

// Profile
router.get('/profile', requireAuth, auth.roleAuthorization(['organization_admin', 'athlete']), (req, res, next) => {
	res.status(200).json({
		user: req.user
	});
});


module.exports = router;
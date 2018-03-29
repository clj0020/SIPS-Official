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
	return jwt.sign(user, config.secret, {
		expiresIn: 10080
	});
}

function setUserInfo(request) {
	return {
		_id: request._id,
		email: request.email,
		name: request.name
	};
}

// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		role: req.body.role
	});

	User.findOne({
		email: req.body.email
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
					msg: 'Failed to register user!' + err.message
				});
			} else {
				userInfo = setUserInfo(user);

				res.status(200).json({
					success: true,
					msg: 'User registered!',
					token: 'JWT ' + generateToken(userInfo),
					user: userInfo
				});
			}
		});
	});
});

// Authenticate
router.post('/login', (req, res, next) => {

	if (!req.body.email) {
		return res.status(422).json({
			success: false,
			errors: {
				email: "No email included in request."
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
				token: 'JWT ' + generateToken(userInfo),
				user: user
			});
		} else {
			return res.status(500).json({
				success: false,
				errors: info
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
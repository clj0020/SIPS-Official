const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Tester = require('../models/tester');

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


module.exports = router;
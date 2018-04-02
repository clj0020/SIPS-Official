const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Admin = require('../models/admin');

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

function setAdminInfo(request) {
	return {
		_id: request._id,
		first_name: request.first_name,
		last_name: request.last_name,
		email: request.email
	};
}

// Register
router.post('/register', (req, res, next) => {
	let newAdmin = new Admin({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password
	});

	console.log(newAdmin);

	Admin.findOne({
		email: req.body.email
	}, (err, existingAdmin) => {
		if (err) {
			return next(err);
		}
		if (existingAdmin) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		Admin.addAdmin(newAdmin, (err, admin) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to add admin!' + err.message
				});
			} else {
				adminInfo = setAdminInfo(admin);

				res.status(200).json({
					success: true,
					msg: 'Admin added to database!',
					token: 'JWT ' + generateToken(adminInfo),
					admin: adminInfo
				});
			}
		});
	});
});

router.post('/update', (req, res, next) => {
	let admin = req.body._id;
	// console.log(admin);
	Admin.updateAdmin(admin, (err, admin) => {
		if (err) {
			res.status(401).json({
				success: false,
				msg: 'Failed to update admin!' + err.message
			});
		} else {
			adminInfo = setAdminInfo(admin);

			res.status(200).json({
				success: true,
				msg: 'Admin updated!',
				token: 'JWT ' + generateToken(adminInfo),
				admin: adminInfo
			});
		}
	});
});


module.exports = router;
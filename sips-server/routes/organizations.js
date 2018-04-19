const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Organization = require('../models/organization');
const Admin = require('../models/admin');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080
	});
}

function setAdminInfo(request) {
	return {
		_id: request._id,
		kind: request.kind,
		created_at: request.created_at,
		first_name: request.first_name,
		last_name: request.last_name,
		email: request.email,
		organization: request.organization
	};
}

var requireAuth = passport.authenticate('jwt', {
	session: false
});

/**
  Organization routes
*/

/** Add Organization

	Description: Add an organization to the database.

	Endpoint: '/organizations/add'

	Method: POST

	Auth: Restricted

	Request: body.title: String (required),
					 req.user: User (optional)

	Response: success: bool (),
						msg: String (),
						organization: Organization ()
*/
router.post('/add', requireAuth, auth.roleAuthorization(['Admin']), (req, res) => {

	let newOrganization = new Organization({
		title: req.body.title,
		creator: req.user
	});

	// // If the user is logged in, set them as the creator of the organization.
	// if (req.body.user) {
	// 	newOrganization.creator = req.body.user;
	// }

	Organization.addOrganization(newOrganization, (err, organization) => {
		if (err) {
			res.status(206).json({
				success: false,
				msg: 'Unable to add organization: ' + err
			});
		} else {

			Admin.findOneAndUpdate({
				_id: req.user._id
			}, {
				'organization': newOrganization._id
			}, {
				new: true
			}, function(err, admin) {
				if (err) {
					res.status(206).json({
						success: false,
						msg: 'Unable to add organization to user object: ' + err
					});
				} else {
					let adminInfo = setAdminInfo(admin);
					let newToken = 'JWT ' + generateToken(adminInfo);
					console.log(adminInfo);
					res.status(200).json({
						success: true,
						msg: 'Successfully added organization!',
						organization: organization,
						token: newToken,
						user: adminInfo
					});
				}
			})

		}
	});
});

/** Get Single Organization

	Description: Get a single organization by ID.

	Endpoint: '/organizations/organization/:id'

	Method: Get

	Auth: Open

	Request: params.id: String (required)

	Response: success: bool (),
						msg: String (),
						organization: Organization ()
*/
router.get('/:id', requireAuth, auth.roleAuthorization([], 'getOrganization'), (req, res) => {
	const id = req.params.id;
	Organization.getOrganizationById(id, (err, organization) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find organization.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found organization.',
				organization: organization
			});
		}
	});
});




module.exports = router;
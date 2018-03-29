const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Organization = require('../models/organization');

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
			res.status(206).send(err);
		} else {
			res.status(200).json({
				success: true,
				msg: 'Successfully added organization!',
				organization: organization
			});
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
router.get('/:id', requireAuth, (req, res) => {
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
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const Organization = require('../models/organization');

/**
  Organization routes
*/


/** List Organizations

    Description: List organizations.
    Endpoint: '/organizations'
    Method: GET
    Auth:
    Request: params.page: Number
    Response: success: bool,
              msg: String,
              organizations: Organization[],
              page: Number,
              pages: Number
*/
router.get('/', (req, res) => {
	const page = (req.params.page > 0 ? req.params.page : 1) - 1;
	const perPage = 15;
	const options = {
		perPage: perPage,
		page: page
	};

	// Call the listOrganizations method of Organization model.
	Organization.listOrganizations(options, (err, organizations) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				data: {
					success: false,
					msg: 'Failed to retrieve organizations: ' + err
				}
			});
		}
		// Get the number of organizations
		Organization.count().exec((err, count) => {
			if (err) {
				return res.json({
					data: {
						success: false,
						msg: 'Failed to retrieve organizations: ' + err
					}
				});
			}
			// Success! Send back organizations along with page info
			res.status(200).json({
				success: true,
				msg: 'Got your organizations.',
				organizations: organizations,
				page: page + 1,
				pages: Math.ceil(count / perPage)
			});
		});
	})
});

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
router.post('/add', passport.authenticate('jwt', {
	session: false
}), (req, res) => {

	let newOrganization = new Organization({
		title: req.body.title,
		organization_admins: [],
		testers: [],
		athletes: [],
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
router.get('/organization/:id', (req, res) => {
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

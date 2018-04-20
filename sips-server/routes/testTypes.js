const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const TestType = require('../models/testType');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

/**
  TestType routes
*/

/** Add Test Type

	Description: Add a test type to the database.

	Endpoint: '/testTypes/add'

	Method: POST

	Auth: Restricted

	Request: body.title: String (required),
					 req.user: User (optional)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.post('/add', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'addTestingData'), (req, res) => {

	let newTestType = new TestType({
		title: req.body.title,
		description: req.body.description,
		duration: req.body.duration,
		organization: req.user.organization,
	});

	TestType.addTestType(newTestType, (err, testType) => {
		if (err) {
			res.status(206).json({
				success: false,
				msg: 'Error adding test type: ' + err
			})

		} else {
			res.status(200).json({
				success: true,
				msg: 'Successfully added test type!',
				testType: {
					_id: testType._id,
					created_at: testType.created_at,
					title: testType.title,
					description: testType.description,
					duration: testType.duration,
					organization: testType.organization,
				}
			});
		}
	});
});

/** Get Single TestType

	Description: Get a single testType by ID.

	Endpoint: '/testTypes/:id'

	Method: Get

	Auth: Open

	Request: params.id: String (required)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getTestTypeInstance'), (req, res) => {
	const id = req.params.id;

	TestType.getTestTypeById(id, (err, testType) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find testType.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found testType.',
				testType: testType
			});
		}
	});
});

router.get('/organization/:organizationId', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getTestTypesFromOrganization'), (req, res) => {
	const organizationId = req.user.organization;

	TestType.getOrganizationTestTypes(organizationId, (err, testTypes) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find testTypes.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found testTypes.',
				testTypes: testTypes
			});
		}
	});
});



module.exports = router;
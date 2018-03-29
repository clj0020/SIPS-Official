const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const TestData = require('../models/testData');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

/**
  TestData routes
*/

/** Add TestData

	Description: Add an testData to the database.

	Endpoint: '/testDatas/add'

	Method: POST

	Auth: Restricted

	Request: body.title: String (required),
					 req.user: User (optional)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.post('/add', requireAuth, auth.roleAuthorization(['Tester']), (req, res) => {

	let newTestData = new TestData({
		athlete: req.body.athleteId,
		tester: req.user,
		accelerometerData: req.body.accelerometerData,
		gyroscopeData: req.body.gyroscopeData,
		magnometerData: req.body.magnometerData
	});

	// // If the user is logged in, set them as the creator of the testData.
	// if (req.body.user) {
	// 	newTestData.creator = req.body.user;
	// }

	TestData.addTestData(newTestData, (err, testData) => {
		if (err) {
			res.status(206).send(err);
		} else {
			res.status(200).json({
				success: true,
				msg: 'Successfully added testData!',
				testData: testData
			});
		}
	});
});

/** Get Single TestData

	Description: Get a single testData by ID.

	Endpoint: '/testDatas/testData/:id'

	Method: Get

	Auth: Open

	Request: params.id: String (required)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.get('/test-data/:id', requireAuth, (req, res) => {
	const id = req.params.id;

	TestData.getTestDataById(id, (err, testData) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find testData.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found testData.',
				testData: testData
			});
		}
	});
});

/** Get All TestData for an athlete */
router.get('/get-athlete-test-data', requireAuth, auth.roleAuthorization(['Tester', 'Admin']), (req, res) => {
	let athleteId = req.params.athleteId;

	console.log(req.params);

	TestData.getAthleteTestData(athleteId, (err, testDataList) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to locate testing data: ' + err
			});
		}

		// Success! Send back testing data array
		res.status(200).json({
			success: true,
			msg: 'Got your testing data.',
			testDataList: testDataList
		});

	});
});

module.exports = router;
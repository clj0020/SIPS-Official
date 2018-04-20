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
router.post('/add', requireAuth, auth.roleAuthorization(['Tester'], 'addTestingData'), (req, res) => {

	let newTestData = new TestData({
		athlete: req.body.athlete,
		tester: req.user,
		testType: req.body.testType,
		accelerometer_data: JSON.parse(req.body.accelerometer_data),
		gyroscope_data: JSON.parse(req.body.gyroscope_data),
		magnometer_data: JSON.parse(req.body.magnometer_data)
	});

	console.log("Uploading Testing Data of type " + req.body.testType);

	TestData.addTestData(newTestData, (err, addedTestData) => {
		if (err) {
			res.status(206).json({
				success: false,
				msg: 'Error adding testing data: ' + err
			})

		} else {
			console.log("AddedTestData" + addedTestData.testType);

			res.status(200).json({
				success: true,
				msg: 'Successfully added testData!',
				testData: {
					_id: addedTestData._id,
					tester: addedTestData.tester._id,
					athlete: addedTestData.athlete._id,
					testType: addedTestData.testType._id,
					accelerometer_data: addedTestData.accelerometer_data,
					gyroscope_data: addedTestData.gyroscope_data,
					magnometer_data: addedTestData.magnometer_data
				}
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
router.get('/athlete/:athleteId/:id', requireAuth, auth.roleAuthorization(['Admin'], 'getTestDataInstance'), (req, res) => {
	const id = req.params.id;
	const athleteId = req.params.athleteId;

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
router.get('/get-athlete-test-data/:athleteId', requireAuth, auth.roleAuthorization(['Admin'], 'getAthletesTestData'), (req, res) => {
	let athleteId = req.params.athleteId;

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
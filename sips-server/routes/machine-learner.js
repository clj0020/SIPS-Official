const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Athlete = require('../models/athlete');
const TestData = require('../models/testData');
const Injury = require('../models/injury');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

// Get list of past injuries for Athlete
router.get('/', requireAuth, auth.roleAuthorization(['Admin'], 'machineLearner'), (req, res) => {
	Promise.all([
			TestData.find(),
			Athlete.find(),
			Injury.find()
		])
		.then(results => {
			const [testingData, athletes, injuries] = results;

			res.status(200).json({
				success: true,
				msg: 'Built dataset.',
				testingData: testingData,
				athletes: athletes,
				injuries: injuries
			});
		})
		.catch(err => {
			console.error("Something went wrong", err);

			res.status(401).json({
				success: false,
				msg: 'Failed to retrieve testing data: ' + err
			});
		});
});


module.exports = router;
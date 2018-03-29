const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Athlete = require('../models/athlete');
const Organization = require('../models/organization');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080
	});
}

function setAthleteInfo(request) {
	return {
		_id: request._id,
		first_name: request.first_name,
		last_name: request.last_name,
		email: request.email,
		dateOfBirth: request.date_of_birth,
		height: request.height,
		weight: request.weight,
		organization: request.organization
	};
}

// Athlete registers themselves


// Add Athlete as Admin and Tester
router.post('/add', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	let newAthlete = new Athlete({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		dateOfBirth: req.body.date_of_birth,
		height: req.body.height,
		weight: req.body.weight,
		organization: req.body.organization,
		password: "placeholder-password"
	});

	console.log(newAthlete);

	Athlete.findOne({
		email: req.body.email
	}, (err, existingAthlete) => {
		if (err) {
			return next(err);
		}
		if (existingAthlete) {
			return res.status(422).json({
				success: false,
				msg: 'That email address is already in use.'
			});
		}

		Athlete.addAthlete(newAthlete, (err, athlete) => {
			if (err) {
				res.status(401).json({
					success: false,
					msg: 'Failed to add athlete!' + err.message
				});
			} else {
				athleteInfo = setAthleteInfo(athlete);

				res.status(200).json({
					success: true,
					msg: 'Athlete added to database!',
					athlete: athleteInfo
				});
			}
		});
	});
});

// Get list of athletes from Organization
router.get('/get-athletes-from-organization', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	let organizationId = req.params.organizationId;

	// Call the getAthletesFromOrganization method of Athlete model.
	Athlete.getAthletesFromOrganization(organizationId, (err, athletes) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to retrieve athletes: ' + err
			});
		}

		Organization.getOrganizationById(organizationId, function(err, organization) {
			if (err) {
				return res.json({
					success: false,
					msg: 'Failed to retrieve organization: ' + err
				});
			}

			console.log(organization);

			// Success! Send back athletes
			res.status(200).json({
				success: true,
				msg: 'Got your athletes.',
				athletes: athletes,
				organization: organization
			});
		});


	})
});

// Get a single athlete
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester']), (req, res, next) => {
	const id = req.params.id;

	Athlete.getAthleteById(id, (err, athlete) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find athlete.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found athlete.',
				athlete: athlete
			});
		}
	});

});


module.exports = router;
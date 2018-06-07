const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const Athlete = require('../models/athlete');
const Injury = require('../models/injury');

var requireAuth = passport.authenticate('jwt', {
	session: false
});

// Get a single injury
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester', 'Athlete'], 'getInjury'), (req, res, next) => {
	const id = req.params.id;

	Injury.getInjuryById(id, (err, injury) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find injury.' + err
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found injury.',
				injury: injury
			});
		}
	});
});

// Add an injury
router.post('/', requireAuth, auth.roleAuthorization(['Admin', 'Tester', 'Athlete'], 'addInjury'), (req, res) => {
	const injury = new Injury({
		title: req.body.title,
		athlete: req.body.athlete,
		date_occurred: req.body.date_occurred
	});

	Injury.addInjury(injury, (err, addedInjury) => {
		if (err) {
			res.status(206).json({
				success: false,
				msg: 'Error adding injury: ' + err
			})

		} else {
			res.status(200).json({
				success: true,
				msg: 'Successfully added injury.',
				injury: addedInjury
			});
		}
	});
});

// Update injury
router.put('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Athlete'], 'editInjury'), (req, res) => {

	Injury.findByIdAndUpdate(req.body._id, req.body, {
		new: true
	}, (err, newInjury) => {
		if (err) {
			res.json({
				success: true,
				msg: 'Failed to edit injury. Error: ' + err
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully edited injury.',
				injury: newInjury
			});
		}
	});
});

// Delete injury
router.delete('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Athlete'], 'deleteInjury'), (req, res, next) => {
	const id = req.params.id;

	Injury.deleteInjuryById(id, (err) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to delete injury.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully deleted injury.'
			});
		}
	});
});

// Get list of past injuries for Athlete
router.get('/athlete/:athleteId', requireAuth, auth.roleAuthorization(['Admin', 'Tester', 'Athlete'], 'getAthleteInjuries'), (req, res, next) => {

	let athleteId = req.params.athleteId;

	Injury.getAthleteInjuries(athleteId, (err, injuries) => {
		// If theres an error, success will be false
		if (err) {
			return res.json({
				success: false,
				msg: 'Failed to retrieve injuries: ' + err
			});
		} else {
			// Success! Send back injuries
			res.status(200).json({
				success: true,
				msg: 'Got athlete injuries.',
				injuries: injuries
			});
		}
	});
});

module.exports = router;
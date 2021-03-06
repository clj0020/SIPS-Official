const User = require('../models/user');
const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

exports.roleAuthorization = function(roles, method) {
	return function(req, res, next) {
		var user = req.user;

		User.findById(user._id, (err, foundUser) => {
			if (err) {
				res.status(422).json({
					error: 'No user found.'
				});
				return next(err);
			}

			if (roles.indexOf(foundUser.kind) > -1) {
				return next();
			} else if (method == "getAthlete") {
				if (foundUser.kind == 'Athlete') {
					if (foundUser._id == req.params.id) {
						return next();
					} else {
						return next(err);
					}
				}
			} else if (method == 'getTestDataInstance') {
				if (foundUser.kind == 'Athlete') {
					if (foundUser._id == req.params.athleteId) {
						return next();
					} else {
						return next(err);
					}
				}
			} else if (method == 'getAthletesTestData') {
				if (foundUser.kind == 'Athlete') {
					if (foundUser._id == req.params.athleteId) {
						return next();
					} else {
						return next(err);
					}
				}
			} else if (method == 'getOrganization') {
				if (foundUser.organization == req.params.id) {
					return next();
				} else {
					return next(err);
				}
			} else if (method == 'getAthleteInjuries') {
				if (foundUser.kind == 'Athlete') {
					if (foundUser._id == req.params.athleteId) {
						return next();
					} else {
						return next(err);
					}
				}
			} else if (method == 'resendAthleteVerification') {
				console.log("Resend verification auth check.");
				if (foundUser.kind == 'Admin') {
					return next();
				} else {
					return next(err);
				}
			}

			res.status(401).json({
				error: 'You are not authorized to view this content.'
			});
			return next('Unauthorized');
		});
	}
}
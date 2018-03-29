const User = require('../models/user');
const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
	var localOptions = {
		usernameField: 'email',
		passwordField: 'password'
	}

	var localLogin = new LocalStrategy(localOptions, function(email, password, done) {
		if (!email) {
			return done(null, false, {
				error: 'Email not included in request.'
			});
		}
		if (!password) {
			return done(null, false, {
				error: 'Password not included in request.'
			});
		}

		User.getUserByEmail(email, (err, user) => {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					error: 'Login failed. Please try again.'
				});
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) {
					return done(err);
				}

				if (!isMatch) {
					return done(null, false, {
						error: 'Wrong password.'
					});
				}

				return done(null, user);
			})
		});
	});

	var jwtOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
		secretOrKey: config.secret
	};

	var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
		User.findById(payload._id, (err, user) => {
			if (err) {
				return done(err, false);
			}

			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	});

	passport.use(jwtLogin);
	passport.use(localLogin);
}
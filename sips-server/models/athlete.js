const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const AthleteSchema = User.discriminator('Athlete', new Schema({
	tests: [{
		type: Schema.ObjectId,
		ref: 'TestData'
	}],
	dateOfBirth: {
		type: Date
	},
	height: Number,
	weight: Number,
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization'
	}
}));

const Athlete = module.exports = mongoose.model('Athlete');

module.exports.getAthleteById = function(id, callback) {
	Athlete.findOne({
		'_id': id
	}, callback);
};

module.exports.addAthlete = function(newAthlete, callback) {

	// TODO: Have to randomly generate a password for new athletes.

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newAthlete.password, salt, (err, hash) => {
			if (err) throw err;
			newAthlete.password = hash;
			newAthlete.save(callback);
		});
	});
};

module.exports.getAthletesFromOrganization = function(organizationId, callback) {
	Athlete.find({
			"organization._id": organizationId
		})
		.populate()
		.sort({
			'createdAt': -1
		})
		.exec(callback);
}
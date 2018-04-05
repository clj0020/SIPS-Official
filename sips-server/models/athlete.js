const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const AthleteSchema = User.discriminator('Athlete', new Schema({
	status: String,
	tests: [{
		type: Schema.ObjectId,
		ref: 'TestData'
	}],
	date_of_birth: {
		type: Date
	},
	height: Number,
	weight: Number
}));

const Athlete = module.exports = mongoose.model('Athlete');

module.exports.getAthleteById = function(id, callback) {
	Athlete.findOne({
		'_id': id
	}, callback);
};

module.exports.addAthlete = function(newAthlete, callback) {
	console.log(newAthlete);
	newAthlete.save(callback);
};

module.exports.verifyAthlete = function(newAthlete, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newAthlete.password, salt, (err, hash) => {
			if (err) throw err;
			newAthlete.password = hash;

			Athlete.findOneAndUpdate({
				_id: newAthlete._id
			}, {
				'first_name': newAthlete.first_name,
				'last_name': newAthlete.last_name,
				'date_of_birth': newAthlete.date_of_birth,
				'height': newAthlete.height,
				'weight': newAthlete.weight,
				'status': newAthlete.status,
				'password': hash
			}, {
				new: true
			}, callback);
		});
	});
};

module.exports.getAthletesFromOrganization = function(organizationId, callback) {
	console.log("OrganizationID: " + organizationId);

	Athlete.find({
			organization: {
				$in: organizationId
			}
		})
		.populate('tests')
		.select('-password')
		.exec(callback);
}
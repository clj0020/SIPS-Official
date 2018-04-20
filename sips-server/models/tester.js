const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const TesterSchema = User.discriminator('Tester', new Schema({
	status: String
}));

const Tester = module.exports = mongoose.model('Tester');

module.exports.addUser = function(newUser, callback) {
	newUser.save(callback);
};

module.exports.verifyTester = function(newTester, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newTester.password, salt, (err, hash) => {
			if (err) throw err;
			newTester.password = hash;

			Tester.findOneAndUpdate({
				_id: newTester._id
			}, {
				'first_name': newTester.first_name,
				'last_name': newTester.last_name,
				'status': newTester.status,
				'password': hash
			}, {
				new: true
			}, callback);
		});
	});
};

module.exports.getTestersFromOrganization = function(organizationId, callback) {
	Tester.find({
			organization: {
				$in: organizationId
			}
		})
		.populate()
		.sort({
			'createdAt': -1
		})
		.exec(callback);
}
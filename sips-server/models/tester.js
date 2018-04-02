const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const TesterSchema = User.discriminator('Tester', new Schema({
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization'
	}
}));

const Tester = module.exports = mongoose.model('Tester');

module.exports.addUser = function(newUser, callback) {
	console.log(newUser);
	newUser.save(callback);
	// bcrypt.genSalt(10, (err, salt) => {
	// 	bcrypt.hash(newUser.password, salt, (err, hash) => {
	// 		if (err) throw err;
	// 		newUser.password = hash;
	// 		newUser.save(callback);
	// 	});
	// });
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
				'password': hash
			}, {
				new: true
			}, callback);
		});
	});


};

module.exports.verifyUser = function(newTester, callback) {

}
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
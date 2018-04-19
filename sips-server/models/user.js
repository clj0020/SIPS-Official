const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// User Schema
//Adding "unique" option to some fields here
// (email and username should be unique fields) -RJM
const UserSchema = new Schema({
	first_name: {
		type: String,
		required: false
	},
	last_name: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: false
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization'
	}
}, {
	discriminatorKey: 'kind'
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
};

module.exports.getUserByEmail = function(email, callback) {
	const query = {
		email: email
	};
	User.findOne(query).populate().exec(callback);
};

module.exports.addUser = function(newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.comparePassword = function(passwordAttempt, password, callback) {

	bcrypt.compare(passwordAttempt, password, function(err, isMatch) {
		callback(null, isMatch);
	});

}
// module.exports.comparePassword = function(candidatePassword, hash, callback) {
// 	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
// 		if (err) throw err;
// 		callback(null, isMatch);
// 	});
// };
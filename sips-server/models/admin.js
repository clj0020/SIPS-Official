const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const AdminSchema = User.discriminator('Admin', new Schema({
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization'
	}
}));

const Admin = module.exports = mongoose.model('Admin');

module.exports.addAdmin = function(newAdmin, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newAdmin.password, salt, (err, hash) => {
			if (err) throw err;
			newAdmin.password = hash;
			newAdmin.save(callback);
		});
	});
};
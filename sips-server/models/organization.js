const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

// Organization Schema
const OrganizationSchema = new Schema({
	title: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

const Organization = module.exports = mongoose.model('Organization', OrganizationSchema);

module.exports.getOrganizationById = function(id, callback) {
	Organization.findOne({
		'_id': id
	}, callback);
};

// List organizations
module.exports.listOrganizations = function(options, callback) {
	const criteria = options.criteria || {};
	Organization.find(criteria)
		.populate()
		.sort({
			'createdAt': -1
		})
		.limit(options.perPage)
		.skip(options.perPage * options.page)
		.exec(callback);
};

module.exports.addOrganization = function(newOrganization, callback) {
	newOrganization.save(callback);
};

module.exports.updateOrganization = function(organization, callback) {
	Organization.findOneAndUpdate({
		id: organization._id
	}, organization, callback);
};
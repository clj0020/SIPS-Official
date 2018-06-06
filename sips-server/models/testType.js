const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

// TestType Schema
const TestTypeSchema = new Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	title: String,
	description: String,
	duration: Number,
	imageUrl: String,
	organization: {
		type: Schema.ObjectId,
		ref: 'Organization'
	},
});

const TestType = module.exports = mongoose.model('TestType', TestTypeSchema);

module.exports.getTestTypeById = function(id, callback) {
	TestType.findOne({
		'_id': id
	}, callback);
};

module.exports.addTestType = function(newTestData, callback) {
	newTestData.save(callback);
};

module.exports.getOrganizationTestTypes = function(organizationId, callback) {
	TestType.find({
			organization: {
				$in: organizationId
			}
		})
		.sort({
			'created_at': -1
		})
		.exec(callback);
}

module.exports.deleteTestTypeById = function(testTypeId, callback) {
	TestType.findByIdAndRemove({
		'_id': testTypeId
	}, callback);
}
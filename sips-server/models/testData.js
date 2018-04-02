const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

// TestData Schema
const TestDataSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now
	},
	athlete: {
		type: Schema.ObjectId,
		ref: 'Athlete'
	},
	tester: {
		type: Schema.ObjectId,
		ref: 'Tester'
	},
	accelerometerData: [{
		time: Date,
		x: Number,
		y: Number,
		z: Number
	}],
	gyroscopeData: [{
		time: Date,
		x: Number,
		y: Number,
		z: Number
	}],
	magnometerData: [{
		time: Date,
		x: Number,
		y: Number,
		z: Number
	}]
});

const TestData = module.exports = mongoose.model('TestData', TestDataSchema);

module.exports.getTestDataById = function(id, callback) {
	TestData.findOne({
		'_id': id
	}, callback);
};

module.exports.addTestData = function(newTestData, callback) {
	newTestData.save(callback);
};

module.exports.getAthleteTestData = function(athleteId, callback) {
	TestData.find({
			'athlete._id': athleteId
		})
		.sort({
			'createdAt': -1
		})
		.exec(callback);
}

module.exports.getTesterTestData = function(testerId, callback) {
	TestData.find({
			'tester._id': testerId
		})
		.sort({
			'createdAt': -1
		})
		.exec(callback);
}

module.exports.updateTestData = function(testData, callback) {
	TestData.findOneAndUpdate({
		id: testData._id
	}, testData, callback);
};
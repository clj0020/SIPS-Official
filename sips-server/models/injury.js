const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

// Injury Schema
const InjurySchema = new Schema({
	title: String,
	date_occurred: {
		type: Date,
		default: Date.now
	},
	athlete: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

const Injury = module.exports = mongoose.model('Injury', InjurySchema);

module.exports.getInjuryById = function(id, callback) {
	Injury.findOne({
		'_id': id
	}, callback);
};

// List injuries
module.exports.listInjuries = function(options, callback) {
	const criteria = options.criteria || {};
	Injury.find(criteria)
		.populate()
		.sort({
			'date_occurred': -1
		})
		.limit(options.perPage)
		.skip(options.perPage * options.page)
		.exec(callback);
};

module.exports.getAthleteInjuries = function(athleteId, callback) {
	Injury.find({
			athlete: {
				$in: athleteId
			}
		})
		.exec(callback);
}

module.exports.addInjury = function(newInjury, callback) {
	newInjury.save(callback);
};

module.exports.updateInjury = function(injury, callback) {
	Injury.findOneAndUpdate({
		id: injury._id
	}, injury, callback);
};

module.exports.deleteInjuryById = function(injuryId, callback) {
	Injury.findByIdAndRemove({
		'_id': injuryId
	}, callback);
}
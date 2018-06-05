const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const TestType = require('../models/testType');
const multer = require('multer');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});

var gcloud = require('google-cloud');

var storage = gcloud.storage({
	projectId: config.projectId,
	keyFilename: config.keyFilename
});

var bucket = storage.bucket(config.bucketName);

var requireAuth = passport.authenticate('jwt', {
	session: false
});

/**
  TestType routes
*/

/** Add Test Type

	Description: Add a test type to the database.

	Endpoint: '/testTypes/add'

	Method: POST

	Auth: Restricted

	Request: body.title: String (required),
					 req.user: User (optional)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.post('/add', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'addTestingData'), upload.single('cover'), (req, res) => {

	let newTestType = new TestType({
		title: req.body.title,
		description: req.body.description,
		duration: req.body.duration,
		organization: req.user.organization,
	});

	if (req.file) {
		uploadCoverImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding test type image: ' + err
				});
			} else {
				newTestType.imageUrl = imageUrl;

				TestType.addTestType(newTestType, (err, testType) => {
					if (err) {
						console.log(err);
						return res.status(206).json({
							success: false,
							msg: 'Error adding test type: ' + err
						});
					} else {
						res.status(200).json({
							success: true,
							msg: 'Successfully added test type!',
							testType: {
								_id: testType._id,
								created_at: testType.created_at,
								title: testType.title,
								description: testType.description,
								duration: testType.duration,
								organization: testType.organization,
							}
						});
					}
				});
			}
		});
	} else {
		TestType.addTestType(newTestType, (err, testType) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding test type: ' + err
				});
			} else {
				res.status(200).json({
					success: true,
					msg: 'Successfully added test type!',
					testType: {
						_id: testType._id,
						created_at: testType.created_at,
						title: testType.title,
						description: testType.description,
						duration: testType.duration,
						organization: testType.organization,
					}
				});
			}
		});
	}
});

router.post('/upload-image', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'uploadTestTypeCoverImage'), upload.single('cover'), (req, res) => {
	let id = req.body.id;

	if (req.file) {
		uploadCoverImage(req.file.buffer, (err, imageUrl) => {
			if (err) {
				console.log(err);
				return res.status(206).json({
					success: false,
					msg: 'Error adding test type image: ' + err
				});
			} else {
				TestType.findByIdAndUpdate(id, {
					'imageUrl': imageUrl
				}, {
					new: true
				}, (err, newTestType) => {
					if (err) {
						res.json({
							success: false,
							msg: 'Failed to update test type.'
						});
					} else {
						res.json({
							success: true,
							msg: 'Successfully uploaded cover image for test type.',
							testType: newTestType
						});
					}
				});
			}
		});
	} else {
		return res.status(206).json({
			success: false,
			msg: 'Error: No image file uploaded.'
		});
	}
});

/** Get Single TestType

	Description: Get a single testType by ID.

	Endpoint: '/testTypes/:id'

	Method: Get

	Auth: Open

	Request: params.id: String (required)

	Response: success: bool (),
						msg: String (),
						testData: TestData ()
*/
router.get('/:id', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getTestTypeInstance'), (req, res) => {
	const id = req.params.id;

	TestType.getTestTypeById(id, (err, testType) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find testType.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found testType.',
				testType: testType
			});
		}
	});
});

router.get('/organization/:organizationId', requireAuth, auth.roleAuthorization(['Admin', 'Tester'], 'getTestTypesFromOrganization'), (req, res) => {
	const organizationId = req.user.organization;

	TestType.getOrganizationTestTypes(organizationId, (err, testTypes) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to find testTypes.'
			});
		} else {
			res.json({
				success: true,
				msg: 'Successfully found testTypes.',
				testTypes: testTypes
			});
		}
	});
});

function uploadCoverImage(coverImageData, callback) {
	// Generate a unique filename for this image
	var filename = '' + new Date().getTime() + "-" + Math.random();
	var file = bucket.file('test-types/' + filename);
	var imageUrl = 'https://' + config.bucketName + '.storage.googleapis.com/test-types/' + filename;
	var stream = file.createWriteStream();
	stream.on('error', callback);
	stream.on('finish', function() {
		// Set this file to be publicly readable
		file.makePublic(function(err) {
			if (err) return callback(err);
			callback(null, imageUrl);
		});
	});
	stream.end(coverImageData);
}

module.exports = router;
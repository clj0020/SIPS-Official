// Server.js is the main file that puts everything together to make an API. We initialize app, connect to the database, and provide routes for the API.
// Will be running on either port 8080 or the port supplied in an environment variable.

'use strict';

const express = require('express'); // core api library
const app = express(); // initialize the app object from express.
const path = require('path');
const bodyParser = require('body-parser'); // parses incoming request bodies
const cors = require('cors'); // cors allows us to make a request to our api from a different domain name because it would be blocked if you didn't
const passport = require('passport'); // the middleware that we use for user authentication.
const mongoose = require('mongoose'); // the middleware that we use to communicate with the MongoDB database.
const config = require('config'); // we get the host information from this

// Connect to database
mongoose.connect(config.DBHost);

// On Database Connection
mongoose.connection.on('connected', () => {
	if (config.util.getEnv('NODE_ENV') !== 'test') {
		console.log('Connected to database ' + config.DBHost);
		console.log("Current WebHost: " + config.WebHost);
		console.log("Current ServerHost: " + config.ServerHost);
	}
});

// On Database Error
mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});


// Body Parser Middleware
app.use(bodyParser.json({
	limit: '50mb',
	type: 'application/json'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));
app.use(bodyParser.text({
	limit: '50mb'
}));

// Include the Routes
const users = require('./routes/users');
const admins = require('./routes/admins');
const testers = require('./routes/testers');
const athletes = require('./routes/athletes');
const injuries = require('./routes/injuries');
const testingData = require('./routes/testingData');
const testTypes = require('./routes/testTypes');
const organizations = require('./routes/organizations');
const machineLearner = require('./routes/machine-learner');

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Passport Middleware
app.use(passport.initialize()); // initialize passport.
// app.use(passport.session()); // initialize session for passport, not currently used.

require('./middleware/passport')(passport);

// Tell the app to use the routes.
app.use('/users', users);
app.use('/admins', admins);
app.use('/testers', testers);
app.use('/athletes', athletes);
app.use('/injuries', injuries);
app.use('/testingData', testingData);
app.use('/testTypes', testTypes);
app.use('/organizations', organizations);
app.use('/machine-learner', machineLearner);

// Index Route
app.get('/', (req, res) => {
	// This is temporary, in this we should check whether the user is authenticated.
	res.status(300).send("Must log in to access api.");
});

// Used to tell the caller than the API endpoint was not found.
app.use((req, res) => {
	res.status(404).send("Endpoint not found!");
});


// Basic error handler
app.use((err, req, res, next) => {
	/* jshint unused:false */
	console.error(err);
	// If our routes specified a specific response, then send that. Otherwise,
	// send a generic message so as not to leak anything.
	res.status(500).send(err.response || 'Something broke!');
});


// Start Server
app.listen(port, () => {
	if (config.util.getEnv('NODE_ENV') !== 'test') {
		console.log('Server started on port ' + port);
	}

	if (config.util.getEnv('NODE_ENV') == 'dev') {
		console.log("In DEV Mode.......");
	} else if (config.util.getEnv('NODE_ENV') == 'production') {
		console.log("In Production Mode.......");
	} else if (config.util.getEnv('NODE_ENV') == 'default') {
		console.log("In Default Mode.......");
	} else if (config.util.getEnv('NODE_ENV') == 'test') {
		console.log("In Test Mode.......");
	}

});

module.exports = app;
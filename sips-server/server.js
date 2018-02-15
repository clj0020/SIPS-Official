// Server.js is the main file that puts everything together to make an API. We initialize app, connect to the database, and provide routes for the API.
// Will be running on either port 8080 or the port supplied in an environment variable.

'use strict';


const express = require('express'); // core api library
const path = require('path');
const bodyParser = require('body-parser'); // parses incoming request bodies
const cors = require('cors'); // cors allows us to make a request to our api from a different domain name because it would be blocked if you didn't
const passport = require('passport'); // the middleware that we use for user authentication.
const mongoose = require('mongoose'); // the middleware that we use to communicate with the MongoDB database.
const config = require('./config/database'); // the database file that is used to connect to the database.
// const session = require('express-session'); // for sessions, not currently used.
// const MemcachedStore = require('connect-memcached')(session); // for sessions, not currently used.

// Connect to database
mongoose.connect(config.database);

// On Database Connection
mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + config.database);
});

// On Database Error
mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});

const app = express(); // initialize the app object from express.

// // Start Session
// // Configure the session and session storage
// const sessionConfig = {
// 	resave: false,
// 	saveUninitialized: false,
// 	secret: config.secret,
// 	signed: true
// };
//
// if (config.MEMCACHE_URL) {
// 	sessionConfig.store = new MemcachedStore({
// 		hosts: [config.MEMCACHE_URL]
// 	});
// }
//
// app.use(session(sessionConfig));
// // End Session
// // OAuth2
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(require('./config/auth').router);

// Include the Users route
const users = require('./routes/users');

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Body Parser Middleware
app.use(bodyParser.json());


// Passport Middleware
app.use(passport.initialize()); // initialize passport.
// app.use(passport.session()); // initialize session for passport, not currently used.

require('./config/passport')(passport);


// Tell the app to use the /users route.
app.use('/users', users);

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
	console.log('Server started on port ' + port);
});

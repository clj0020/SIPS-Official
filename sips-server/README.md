# SIPS Server #

** Must be running to use server. Also requires a MongoDB instance, but more on that below. **

## To run ##

### 1. Install dependencies with NPM ###

[Download Node.js](https://nodejs.org/en/download/) if you don't have it and install the dependencies with NPM.

```command prompt

npm install
```

### 2. Create a production and test MongoDB Instance ###

Either locally or hosted on a site like mLab.

### 3. Create a config folder in the root directory of sips-server and four files:

##### Create these four files in the config folder
* default.json
* dev.json
* production.json
* test.json


##### default.json
```javascript

{
  "DBHost": "mongodb://{mlabUserName}:{mlabPassword}@{mLabHost}",
  "secret": "EXAMPLE_SECRET_KEY",
  "ServerHost": "SERVER URL in Production (Google Cloud)",
  "WebHost": "WEB APP URL in Production (Google Cloud)",
  "GMAIL_USERNAME": "exampleGmailUsername (dont include @gmail.com)",
  "GMAIL_PASS": "exampleGmailPassword"
}
```

##### dev.json
```javascript

{
  "DBHost": "mongodb://{mlabUserName}:{mlabPassword}@{mLabHostTestDatabase}",
  "secret": "EXAMPLE_SECRET_KEY",
  "ServerHost": "http://localhost:8080",
  "WebHost": "http://localhost:4200",
  "GMAIL_USERNAME": "exampleGmailUsername (dont include @gmail.com)",
  "GMAIL_PASS": "exampleGmailPassword"
}
```

##### production.json
```javascript

{
  "DBHost": "mongodb://{mlabUserName}:{mlabPassword}@{mLabHost}",
  "secret": "EXAMPLE_SECRET_KEY",
  "ServerHost": "SERVER URL in Production (Google Cloud)",
  "WebHost": "WEB APP URL in Production (Google Cloud)",
  "GMAIL_USERNAME": "exampleGmailUsername (dont include @gmail.com)",
  "GMAIL_PASS": "exampleGmailPassword"
}
```
##### test.json
```javascript

{
  "DBHost": "mongodb://{mlabUserName}:{mlabPassword}@{mLabHostTestDatabase}",
  "secret": "EXAMPLE_SECRET_KEY",
  "ServerHost": "http://localhost:8080",
  "WebHost": "http://localhost:4200",
  "GMAIL_USERNAME": "exampleGmailUsername (dont include @gmail.com)",
  "GMAIL_PASS": "exampleGmailPassword"
}
```


### 4a. To run project in Default Mode:

```command prompt

npm start
```

### 4b. To run project in Development mode:

```command prompt

npm run start-dev
```

### 4c. To run project in Production mode:

```command prompt

npm run start-prod
```

### 4d. To run tests

```command prompt

npm test
```


__Changes are automatically updated using Nodemon.__

## How it works ##

* [server.js](sips-server/server.js) - This is the main file that puts everything together to make an API. We initialize app, connect to the database, and provide routes for the API.
* [routes/](sips-server/routes) - This is the directory that holds the route files, to include a routes file in the project you must add it to the server.js file.
  * [routes/admins.js](sips-server/routes/admins.js) - This is the routes file for the admin model.
  * [routes/athletes.js](sips-server/routes/athletes.js) - This is the routes file for the athlete model.
  * [routes/organizations.js](sips-server/routes/organizations.js) - This is the routes file for the organization model.
  * [routes/admins.js](sips-server/routes/testers.js) - This is the routes file for the tester model.
  * [routes/admins.js](sips-server/routes/testingData.js) - This is the routes file for the testData model.
  * [routes/users.js](sips-server/routes/users.js) - This is the routes file for the user model.
* [models/](sips-server/models) - This is the directory that holds the models for the api, each model file contains the schema of the model and the [mongoose](http://mongoosejs.com/) methods for interacting with those model objects in the database.
  * [models/user.js](sips-server/models/user.js) - This is the model file for the user. It includes the user schema as well as methods for adding users to the database, retrieving users, and comparing user passwords. Contains reference to Organization document.
  * [models/admin.js](sips-server/models/admin.js) - This is the model file for the admin. It is a subschema of the user model by using the discriminatorKey from Mongoose.js.
  * [models/athlete.js](sips-server/models/athlete.js) - This is the model file for the athlete. It is a subschema of the user model by using the discriminatorKey from Mongoose.js.
  * [models/admin.js](sips-server/models/tester.js) - This is the model file for the tester. It is a subschema of the user model by using the discriminatorKey from Mongoose.js.
  * [models/organization.js](sips-server/models/organization.js) - This is the model file for the organization.
  * [models/testData.js](sips-server/models/testData.js) - This is the model file for the testData. Contains references to athlete and tester. Includes accelerometer, gyroscope, and magnometer sensor data in arrays.
* [middleware/](sips-server/middleware) - This is the directory that holds the Express.js middleware functions.
  * [middleware/auth.js](sips-server/middleware/auth.js) - The auth.js file is for making sure that the right user is calling the right endpoints based on their role permissions.
  * [middleware/passport.js](sips-server/middleware/passport.js) - The passport.js file is for handling user authorization using the Passport.js library.
* config/ - This is the directory that holds the config files of the project, basically environment variables based on what mode the project is being run in. You will need to create these files, make sure to exclude this folder in the .gitignore file.
* [app.yaml](sips-server/app.yaml) - Config file for uploading to Google Cloud.
* [package.json](sips-server/package.json) - This is the file that includes metadata about the project as well as being used by NPM to install the right dependencies. When adding a dependency, it is important to either put the dependency into this file before installing it or to include the --save tag when installing from the command line.

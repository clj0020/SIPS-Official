# SIPS Server #

** Must be running to use server. Also requires a MongoDB instance, but more on that below. **

## To run ##

### 1. Install dependencies with NPM ###

[Download Node.js](https://nodejs.org/en/download/) if you don't have it and install the dependencies with NPM.

```command prompt

npm install
```

### 2. Create a MongoDB Instance ###

Either locally or hosted on a site like mLab.

### 3. Create a keys.json file in the root directory of sips-server

```javascript

{
  "mongoHost": "host",
  "mongoPort": "1111",
  "mongoDatabase": "database-name",
  "mongoUser": "username",
  "mongoPass": "password",
  "SECRET" : "secret"
}
```

### 4. Run project

```command prompt

npm start
```

__Will be running on either port 8080 or the port supplied in an environment variable.__

### 5. Test the project

To test the project, open up a web browser, or better yet [Postman](https://www.getpostman.com/), and go to [http://localhost:8080]. You should have gotten the message "Must log in to access api." and a 300 error code. To further test the API, look at the endpoints and try to access them including what is needed in the request. Currently, you must visit the register endpoint to create a user in the database and recieve a token. If you have already created a user, then visit the login endpoint with your credentials in the request to recieve the token. Save this token because it is needed in the header of your requests for any other endpoints.

## How it works ##

* [server.js](sips-server/server.js) - This is the main file that puts everything together to make an API. We initialize app, connect to the database, and provide routes for the API.
* [routes/](sips-server/routes) - This is the directory that holds the route files, to include a routes file in the project you must add it to the server.js file.
  * [routes/users.js](sips-server/routes/users.js) - This is the routes file for the user model. It includes routes for registering users, logging in, and retrieving user's profiles.
* [models/](sips-server/models) - This is the directory that holds the models for the api, each model file contains the schema of the model and the [mongoose](http://mongoosejs.com/) methods for interacting with those model objects in the database.
  * [models/user.js](sips-server/models/user.js) - This is the model file for the user. It includes the user schema as well as methods for adding users to the database, retrieving users, and comparing user passwords.
* [config/](sips-server/config) - This is the directory that holds the config files of the project. Examples include database.js and passport.js.
* keys.json - Not included in the project, must be created. The keys.json file is a private file that includes sensitive variables such as passwords.
* [app.yaml](sips-server/app.yaml) - Not too sure what exactly this file does, but it made the project work when uploaded to Google Cloud, so it's important.
* [package.json](sips-server/package.json) - This is the file that includes metadata about the project as well as being used by NPM to install the right dependencies. When adding a dependency, it is important to either put the dependency into this file before installing it or to include the --save tag when installing from the command line.

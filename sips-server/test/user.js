// During the test, the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../models/user');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {

	describe('Create Account, Login, and Check token', () => {

		beforeEach((done) => {
			// Reset user mode before each test
			User.remove({}, (err) => {
				done();
			})
		});

		it('should Register and check token', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword',
					'role': 'organization_admin'
				})
				.end((err, res) => {
					res.should.have.status(200);

					res.body.should.have.property('success');
					res.body.success.should.be.a('boolean');
					res.body.success.should.be.eql(true);

					res.body.should.have.property('msg');
					res.body.msg.should.be.a('string');
					res.body.msg.should.be.eql('User registered!');

					res.body.should.have.property('token');
					res.body.token.should.be.a('string');

					res.body.should.have.property('user');
					res.body.user.should.be.a('object');

					res.body.user.should.have.property('role');
					res.body.user.role.should.be.a('string');
					res.body.user.role.should.be.eql('organization_admin');

					let token = res.body.token;

					chai.request(server)
						.get('/users/profile')
						.set('Authorization', token)
						.end((err, res) => {
							res.should.have.status(200);

							res.body.should.have.property('user');
							res.body.user.should.be.a('object');

							res.body.user.should.have.property('_id');
							res.body.user._id.should.be.a('string');

							res.body.user.should.have.property('name');
							res.body.user.name.should.be.a('string');

							res.body.user.should.have.property('username');
							res.body.user.username.should.be.a('string');

							res.body.user.should.have.property('email');
							res.body.user.email.should.be.a('string');

							done();
						});
				});
		});

		it('should fail to Register due to duplicate users', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword',
					'role': 'organization_admin'
				})
				.end((err, res) => {
					res.should.have.status(200);

					chai.request(server)
						.post('/users/register')
						.send({
							'name': 'Test Name',
							'email': 'test@email.com',
							'username': 'testUser',
							'password': 'testPassword',
							'role': 'organization_admin'
						})
						.end((err, res) => {
							res.should.have.status(422);
							res.should.be.json;

							res.body.should.have.property('success');
							res.body.success.should.be.a('boolean');
							res.body.success.should.be.eql(false);

							res.body.should.have.property('msg');
							res.body.msg.should.be.a('string');
							res.body.msg.should.be.eql('That email address is already in use.');

							done();
						});
				});
		});

		it('should fail to Register due to missing parameters', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword'
				})
				.end((err, res) => {
					res.should.have.status(401);
					res.should.be.json;

					res.body.should.have.property('success');
					res.body.success.should.be.a('boolean');
					res.body.success.should.be.eql(false);

					res.body.should.have.property('msg');
					res.body.msg.should.be.a('string');

					done();
				});
		})

		it('should Register, then fail to Login due to user not found', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword',
					'role': 'organization_admin'
				})
				.end((err, res) => {
					res.should.have.status(200);

					// Follow up with logging in
					chai.request(server)
						.post('/users/login')
						.send({
							'username': 'wrong-username',
							'password': 'testPassword'
						})
						.end((err, res) => {
							res.should.have.status(500);

							// res.body.should.have.property('success');
							// res.body.success.should.be.a('boolean');
							// res.body.success.should.be.eql(false);
							//
							// res.body.should.have.property('msg');
							// res.body.msg.should.be.a('string');
							// res.body.msg.should.be.eql('User not found!');
							done();
						});
				});
		});

		it('should Register, then fail to Login due to wrong password', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword',
					'role': 'organization_admin'
				})
				.end((err, res) => {
					res.should.have.status(200);

					// Follow up with logging in
					chai.request(server)
						.post('/users/login')
						.send({
							'username': 'testUser',
							'password': 'wrongPassword'
						})
						.end((err, res) => {
							res.should.have.status(500);

							res.body.should.have.property('success');
							res.body.success.should.be.a('boolean');
							res.body.success.should.be.eql(false);

							res.body.should.have.property('errors');
							res.body.errors.should.have.property('error');
							res.body.errors.error.should.be.eql('Wrong password.');

							done();
						});
				});
		});

		it('should Register, then fail to Login due to missing password parameter', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword',
					'role': 'organization_admin'
				})
				.end((err, res) => {
					res.should.have.status(200);

					// Follow up with logging in
					chai.request(server)
						.post('/users/login')
						.send({
							'username': 'testUser'
						})
						.end((err, res) => {
							res.should.have.status(422);

							res.body.should.have.property('success');
							res.body.success.should.be.a('boolean');
							res.body.success.should.be.eql(false);

							res.body.should.have.property('errors');
							res.body.errors.should.have.property('password');
							res.body.errors.password.should.be.eql('No password included in request.');
							done();
						});
				});

		});

		it('should Register, then fail to Login due to missing username parameter', (done) => {
			chai.request(server)
				.post('/users/register')
				.send({
					'name': 'Test Name',
					'email': 'test@email.com',
					'username': 'testUser',
					'password': 'testPassword'
				})
				.end((err, res) => {
					res.should.have.status(200);

					// Follow up with logging in
					chai.request(server)
						.post('/users/login')
						.send({
							'password': 'testPassword'
						})
						.end((err, res) => {
							res.should.have.status(422);

							res.body.should.have.property('success');
							res.body.success.should.be.a('boolean');
							res.body.success.should.be.eql(false);

							res.body.should.have.property('errors');
							res.body.errors.should.have.property('username');
							res.body.errors.username.should.be.eql('No username included in request.');

							done();
						});
				});

		});
	});


	// describe('Login', () => {
	// 	it('it should login the user', (done) => {
	//
	// 		chai.request(server)
	// 			.post('/users/login')
	// 			.send({
	// 				username: 'cjones3724',
	// 				password: 'password'
	// 			})
	// 			.end((err, res) => {
	// 				res.should.have.status(200);
	// 				res.should.be.json;
	//
	// 				res.body.should.have.property('success');
	// 				res.body.success.should.be.a('boolean');
	// 				res.body.success.should.be.eql(true);
	//
	// 				res.body.should.have.property('token');
	// 				res.body.token.should.be.a('string');
	//
	// 				res.body.should.have.property('user');
	// 				res.body.user.should.be.a('object');
	//
	// 				res.body.user.should.have.property('id');
	// 				res.body.user.id.should.be.a('string');
	//
	// 				res.body.user.should.have.property('name');
	// 				res.body.user.name.should.be.a('string');
	//
	// 				res.body.user.should.have.property('username');
	// 				res.body.user.username.should.be.a('string');
	//
	// 				res.body.user.should.have.property('email');
	// 				res.body.user.email.should.be.a('string');
	//
	// 				done();
	// 			});
	// 	});
	//
	// 	it('it should not find the user after login attempt', (done) => {
	// 		chai.request(server)
	// 			.post('/users/login')
	// 			.send({
	// 				username: 'fakeusername',
	// 				password: 'password'
	// 			})
	// 			.end((err, res) => {
	// 				res.should.have.status(404);
	// 				res.body.should.be.a('object');
	//
	//
	// 				res.body.should.have.property('success');
	// 				res.body.success.should.be.a('boolean');
	// 				res.body.success.should.be.eql(false);
	//
	// 				res.body.should.have.property('msg');
	// 				res.body.msg.should.be.a('string');
	// 				res.body.msg.should.be.eql('User not found!');
	// 				done();
	// 			});
	// 	});
	//
	// 	it('it should not match the users password', (done) => {
	// 		chai.request(server)
	// 			.post('/users/login')
	// 			.send({
	// 				username: 'cjones3724',
	// 				password: 'wrong-password'
	// 			})
	// 			.end((err, res) => {
	// 				res.should.have.status(400);
	// 				res.body.should.be.a('object');
	//
	// 				res.body.should.have.property('success');
	// 				res.body.success.should.be.a('boolean');
	// 				res.body.success.should.be.eql(false);
	//
	// 				res.body.should.have.property('msg');
	// 				res.body.msg.should.be.a('string');
	// 				res.body.msg.should.be.eql('Wrong password!');
	// 				done();
	// 			});
	// 	});
	//
	// });
});
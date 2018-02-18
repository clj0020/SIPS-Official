// During the test, the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Organization = require('../models/organization');
const User = require('../models/user');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Organizations', () => {
	beforeEach((done) => { // Before each test we empty the database
		Organization.remove({}, (err) => {
			done();
		});
	});

	beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});
	});


	describe('Get list', () => {
		it('it should GET all the organizations', (done) => {
			chai.request(server)
				.get('/organizations')
				.end((err, res) => {
					res.should.have.status(200);
					res.should.be.json;

					res.body.should.have.property('success');
					res.body.success.should.be.a('boolean');
					res.body.success.should.be.eql(true);

					res.body.should.have.property('msg');
					res.body.msg.should.be.a('string');

					res.body.should.have.property('organizations');
					res.body.organizations.should.be.a('array');
					res.body.organizations.length.should.be.eql(0);

					res.body.should.have.property('page');
					res.body.should.have.property('pages');
					done();
				});
		});
	});

	describe('Add Organization', () => {

		it('it should not POST an organization without user object', (done) => {
			let organization = {
				title: "Auburn University"
			}
			chai.request(server)
				.post('/organizations/add')
				.send(organization)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					// res.body.should.have.property('errors');
					// res.body.errors.should.have.property('creator');
					// res.body.errors.creator.should.have.property('kind').eql('required');
					done();
				});

		});

		it('it should create an organization object', (done) => {
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

					res.body.user.should.have.property('_id');
					res.body.user._id.should.be.a('string');

					res.body.user.should.have.property('name');
					res.body.user.name.should.be.a('string');

					res.body.user.should.have.property('username');
					res.body.user.username.should.be.a('string');

					res.body.user.should.have.property('email');
					res.body.user.email.should.be.a('string');

					res.body.user.should.have.property('role');
					res.body.user.role.should.be.a('string');
					res.body.user.role.should.be.eql('organization_admin');

					let token = res.body.token;

					chai.request(server)
						.post('/organizations/add')
						.set('Authorization', token)
						.send({
							title: "Auburn University"
						})
						.end((err, res) => {
							res.should.have.status(200);

							res.body.should.have.property('success');
							res.body.success.should.be.a('boolean');
							res.body.success.should.be.eql(true);

							res.body.should.have.property('msg');
							res.body.msg.should.be.a('string');
							res.body.msg.should.be.eql('Successfully added organization!');

							res.body.should.have.property('organization');

							done();
						});

				});

		});

		// it('it should POST an organization', (done) => {
		// 	let user = {
		// 		name: "Test User",
		// 		email: "testuser@gmail.com",
		// 		username: "test-user",
		// 		password: "password"
		// 	}
		//
		// 	chai.request(server)
		// 		.post('/users/register')
		// 		.send(user)
		// 		.end((err, res) => {
		//
		// 			newUser = res.body.user;
		//
		// 			// console.log(res.body);
		//
		// 			let organization = {
		// 				title: "Auburn University",
		// 				creator: newUser._id
		// 			}
		//
		// 			chai.request(server)
		// 				.post('/organizations/add')
		// 				.send(organization)
		// 				.end((err, res) => {
		// 					res.should.have.status(200);
		// 					res.body.should.be.a('object');
		//
		// 					res.body.should.have.property('success');
		//
		// 					res.body.should.have.property('msg');
		//
		// 					res.body.should.have.property('organization');
		// 					done();
		// 				});
		// 		});
		//
		// });

	});
});

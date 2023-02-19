// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

// packages
import axios from 'axios';
import { expect } from 'chai';
import request from 'supertest';

const API_URL = process.env.API_URL;

describe('Item api', () => {
  let userToken: string, adminToken: string;

  beforeAll(async () => {
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'password',
    });
    adminToken = adminLogin.data.token;

    const userLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'password',
    });
    userToken = userLogin.data.token;
  });

  describe('Create item', () => {
    const itemToCreate = {
      name: 'test item',
      description: 'test description',
      price: 100,
    };

    it('should throw 401 error when not logged in', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(401);
          expect(body).to.have.property('message');
          done();
        });
    });

    it('should create item when logged in as user', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(201);
          expect(body).to.have.property('id');
          expect(body).to.have.property('userId');
          expect(body).to.have.property('name').that.equal(itemToCreate.name);
          expect(body)
            .to.have.property('description')
            .that.equal(itemToCreate.description);
          expect(body).to.have.property('price').that.equal(itemToCreate.price);
          done();
        });
    });

    it('should create item when logged in as admin', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(201);
          expect(body).to.have.property('id');
          expect(body).to.have.property('userId');
          expect(body).to.have.property('name').that.equal(itemToCreate.name);
          expect(body)
            .to.have.property('description')
            .that.equal(itemToCreate.description);
          expect(body).to.have.property('price').that.equal(itemToCreate.price);
          done();
        });
    });

    it('should throw 422 error when invalid input is provided', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'n',
          description: 'd',
          price: -101,
        })
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(422);
          expect(body).to.have.property('message');
          expect(body).to.have.property('errors');
          // Because provided name was invalid
          expect(body.errors).to.have.property('name').that.is.an('array');
          // Because provided description was invalid
          expect(body.errors)
            .to.have.property('description')
            .that.is.an('array');
          // Because provided price was invalid
          expect(body.errors).to.have.property('price').that.is.an('array');
          done();
        });
    });
  });

  describe('Fetch items', () => {
    let firstItem: {
      id: string;
      userId: string;
      name: string;
      description: string;
      price: number;
    };

    it('should return items array when not authenticated', done => {
      request(API_URL)
        .get('/items')
        .set('Accept', 'application/json')
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('array').that.include.members;

          firstItem = body[0];
          expect(firstItem.id).to.be.a('string');
          expect(firstItem.userId).to.be.a('string');
          expect(firstItem.name).to.be.a('string');
          expect(firstItem.description).to.be.a('string');
          expect(firstItem.price).to.be.a('number');

          done();
        });
    });

    it('should return items array when logged in as user', done => {
      request(API_URL)
        .get('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('array');
          done();
        });
    });

    it('should return items array when logged in as admin', done => {
      request(API_URL)
        .get('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('array');
          done();
        });
    });

    it('should return item array with this structure', () => {
      expect(firstItem.id).to.be.a('string');
      expect(firstItem.userId).to.be.a('string');
      expect(firstItem.name).to.be.a('string');
      expect(firstItem.description).to.be.a('string');
      expect(firstItem.price).to.be.a('number');
    });
  });
});

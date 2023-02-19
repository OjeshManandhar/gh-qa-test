// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

// packages
import axios from 'axios';
import { expect } from 'chai';
import request from 'supertest';

// utils
import { generateRandomSlug } from './../utils/random-slug';

// types
import type { Item, User } from './types';

const API_URL = process.env.API_URL;

describe('Item api', () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user: { token: string; me: User } = { token: '', me: null! };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const admin: { token: string; me: User } = { token: '', me: null! };

  let itemCreatedByUser: Item, itemCreatedByAdmin: Item;

  beforeAll(async () => {
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'password',
    });
    admin.token = adminLogin.data.token;
    const adminMe = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    });
    admin.me = adminMe.data.data;

    const userLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'password',
    });
    user.token = userLogin.data.token;
    const userMe = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    user.me = userMe.data.data;
  });

  describe('Create item', () => {
    const itemToCreate = {
      name: 'test item',
      description: 'test description',
      price: 100,
    };

    // update itemToCreate for each test
    beforeEach(() => {
      itemToCreate.name = `test item ${generateRandomSlug(3)}`;
      itemToCreate.description = `test description ${generateRandomSlug(3)}`;
      itemToCreate.price = Math.floor(Math.random() * 100);
    });

    it('should return 401 error when not logged in', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(401);
          expect(body).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('should create item when logged in as user', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(201);
          expect(body).to.have.property('id');
          expect(body).to.have.property('userId').that.equal(user.me.id);
          expect(body).to.have.property('name').that.equal(itemToCreate.name);
          expect(body)
            .to.have.property('description')
            .that.equal(itemToCreate.description);
          expect(body).to.have.property('price').that.equal(itemToCreate.price);

          // save item for later tests
          itemCreatedByUser = body;

          done();
        });
    });

    it('should create item when logged in as admin', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(itemToCreate)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(201);
          expect(body).to.have.property('id');
          expect(body).to.have.property('userId').that.equal(admin.me.id);
          expect(body).to.have.property('name').that.equal(itemToCreate.name);
          expect(body)
            .to.have.property('description')
            .that.equal(itemToCreate.description);
          expect(body).to.have.property('price').that.equal(itemToCreate.price);

          // save item for later tests
          itemCreatedByAdmin = body;

          done();
        });
    });

    it('should throw 422 error when invalid input is provided', done => {
      request(API_URL)
        .post('/items')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${admin.token}`)
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
    let firstItem: Item;

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
        .set('Authorization', `Bearer ${user.token}`)
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
        .set('Authorization', `Bearer ${admin.token}`)
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

  describe('Fetch single item', () => {
    it('should return item when not authenticated', done => {
      request(API_URL)
        .get(`/items/${itemCreatedByAdmin.id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('object');
          expect(body.id).to.equal(itemCreatedByAdmin.id);
          expect(body.userId).to.equal(itemCreatedByAdmin.userId);
          expect(body.name).to.equal(itemCreatedByAdmin.name);
          expect(body.description).to.equal(itemCreatedByAdmin.description);
          expect(body.price).to.equal(itemCreatedByAdmin.price);
          done();
        });
    });

    it('should return item when logged in as user', done => {
      request(API_URL)
        .get(`/items/${itemCreatedByAdmin.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('object');
          expect(body.id).to.equal(itemCreatedByAdmin.id);
          expect(body.userId).to.equal(itemCreatedByAdmin.userId);
          expect(body.name).to.equal(itemCreatedByAdmin.name);
          expect(body.description).to.equal(itemCreatedByAdmin.description);
          expect(body.price).to.equal(itemCreatedByAdmin.price);
          done();
        });
    });

    it('should return item when logged in as admin', done => {
      request(API_URL)
        .get(`/items/${itemCreatedByAdmin.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${admin.token}`)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('object');
          expect(body.id).to.equal(itemCreatedByAdmin.id);
          expect(body.userId).to.equal(itemCreatedByAdmin.userId);
          expect(body.name).to.equal(itemCreatedByAdmin.name);
          expect(body.description).to.equal(itemCreatedByAdmin.description);
          expect(body.price).to.equal(itemCreatedByAdmin.price);
          done();
        });
    });
  });

  describe('Update item', () => {
    const newItemValues = {
      name: 'new name',
      description: 'new description',
      price: 100,
    };

    // update itemToCreate for each test
    beforeEach(() => {
      newItemValues.name = `test item ${generateRandomSlug(3)}`;
      newItemValues.description = `test description ${generateRandomSlug(3)}`;
      newItemValues.price = Math.floor(Math.random() * 100);
    });

    it('should return 401 error when not authenticated', done => {
      request(API_URL)
        .put(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .send(newItemValues)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(401);
          expect(body).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('should return 403 error when trying to update item created by another user', done => {
      request(API_URL)
        .put(`/items/${itemCreatedByAdmin.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .send(newItemValues)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(403);
          expect(body).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('should return updated item when updating own item as user', done => {
      request(API_URL)
        .put(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .send(newItemValues)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('object');
          expect(body.id).to.equal(itemCreatedByUser.id);
          expect(body.userId).to.equal(itemCreatedByUser.userId);
          expect(body.name).to.equal(newItemValues.name);
          expect(body.description).to.equal(newItemValues.description);
          expect(body.price).to.equal(newItemValues.price);
          done();
        });
    });

    it('should return updated item when updating item of other user as admin', done => {
      request(API_URL)
        .put(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${admin.token}`)
        .send(newItemValues)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('object');
          expect(body.id).to.equal(itemCreatedByUser.id);
          expect(body.userId).to.equal(itemCreatedByUser.userId);
          expect(body.name).to.equal(newItemValues.name);
          expect(body.description).to.equal(newItemValues.description);
          expect(body.price).to.equal(newItemValues.price);
          done();
        });
    });

    it('should throw 422 error when invalid input is provided', done => {
      request(API_URL)
        .put(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${admin.token}`)
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

  describe('Delete item', () => {
    it('should return 401 error when not authenticated', done => {
      request(API_URL)
        .delete(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(401);
          expect(body).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('should return 403 error when trying to delete item as a user', done => {
      request(API_URL)
        .delete(`/items/${itemCreatedByUser.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${user.token}`)
        .end((err, res) => {
          const body = res.body;

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(403);
          expect(body).to.have.property('message').that.is.a('string');
          done();
        });
    });

    it('should delete and return deleting item when deleting as admin', done => {
      axios.get(`${API_URL}/items`).then(res => {
        const itemToDelete = res.data[0];

        request(API_URL)
          .delete(`/items/${itemToDelete.id}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${admin.token}`)
          .end((err, res) => {
            const body = res.body;

            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            expect(body).to.be.an('object');
            expect(body.id).to.equal(itemToDelete.id);
            expect(body.userId).to.equal(itemToDelete.userId);
            expect(body.name).to.equal(itemToDelete.name);
            expect(body.description).to.equal(itemToDelete.description);
            expect(body.price).to.equal(itemToDelete.price);
            done();
          });
      });
    });
  });
});

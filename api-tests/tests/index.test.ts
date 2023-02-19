// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

// packages
import axios from 'axios';
import { expect } from 'chai';
import request from 'supertest';

const API_URL = process.env.API_URL;

describe('Item api', () => {
  let userToken: string, authToken: string;

  beforeAll(async () => {
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'password',
    });
    authToken = adminLogin.data.token;

    const userLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'password',
    });
    userToken = userLogin.data.token;
  });

  describe('Fetch items', () => {
    it('should return items array when not authenticated', done => {
      request(API_URL)
        .get('/items')
        .set('Accept', 'application/json')
        .end((err, res) => {
          const body = res.body;
          console.log('res:', body);

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('array');
          done();
        });
    });
  });
});

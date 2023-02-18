// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

const API_URL = process.env.API_URL;

console.log('API_URL', API_URL);

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

test('adds 3 + 2 to equal 3', () => {
  expect(3 + 2).toBe(4);
});

test('adds 3 + 2 to equal 3', () => {
  expect(3 + 2).toBe(5);
});

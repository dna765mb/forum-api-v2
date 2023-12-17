const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const injections = require('../../injections');
const createServer = require('../createServer');
 
describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });
 
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });
 
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});
 
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });
 
    // Assert
    expect(response.statusCode).toEqual(404);
  });
 
  describe('when GET /', () => {
    it('should return 200 and hello world', async () => {
      // Arrange
      const server = await createServer({});
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Hello world!');
    });
  });
 
  // Skenario testing lain ...
});
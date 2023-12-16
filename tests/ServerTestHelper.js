/* istanbul ignore file */

const ServerTestHelper = {
  async registerUser({ server, username = "sakti" }) {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username,
        password: "secret",
        fullname: "kurniawan sakti",
      },
    });

    const {
      data: {
        addedUser: { id },
      },
    } = JSON.parse(response.payload);
    return id;
  },

  async getAccessToken({ server, username = "sakti" }) {
    const user = { username, password: "secret" };

    const loginUser = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: user,
    });

    const {
      data: { accessToken },
    } = JSON.parse(loginUser.payload);

    return accessToken;
  },
};

module.exports = ServerTestHelper;

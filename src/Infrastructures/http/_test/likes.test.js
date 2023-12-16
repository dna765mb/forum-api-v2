const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    pool.end();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const server = await createServer(container);
      const data = {
        threadId: "thread-123",
        commentId: "comment-123",
      };

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${data.threadId}/comments/${data.commentId}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 200 and should have one length when like comment", async () => {
      const server = await createServer(container);
      const userId = await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      const data = {
        threadId: "thread-123",
        commentId: "comment-123",
        owner: userId,
      };

      await ThreadTableTestHelper.addThread({
        id: data.threadId,
        owner: userId,
      });
      await CommentTableTestHelper.addComment({
        id: data.commentId,
        threadId: data.threadId,
        owner: data.owner,
      });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${data.threadId}/comments/${data.commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const likes = await CommentLikesTableTestHelper.verifyAvailableLike({
        commentId: data.commentId,
        owner: data.owner,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(likes).toHaveLength(1);
    });

    it("should response 200 and should have no length when unlike comment", async () => {
      const server = await createServer(container);
      const userId = await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      const data = {
        threadId: "thread-123",
        commentId: "comment-123",
        owner: userId,
      };

      await ThreadTableTestHelper.addThread({
        id: data.threadId,
        owner: userId,
      });
      await CommentTableTestHelper.addComment({
        id: data.commentId,
        threadId: data.threadId,
        owner: data.owner,
      });
      await CommentLikesTableTestHelper.likeComment({
        commentId: data.commentId,
        owner: data.owner,
      });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${data.threadId}/comments/${data.commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const likes = await CommentLikesTableTestHelper.verifyAvailableLike({
        commentId: data.commentId,
        owner: data.owner,
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(likes).toHaveLength(0);
    });
  });
});

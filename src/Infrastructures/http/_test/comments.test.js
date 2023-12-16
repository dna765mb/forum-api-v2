const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const requestPayload = {
        content: "Comment content test",
        owner: "user-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};

      const server = await createServer(container);

      await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan comment, request payload tidak lengkap"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      const server = await createServer(container);

      await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat menambahkan comment, tipe data tidak sesuai"
      );
    });

    it("should response 404 when id thread not found in database", async () => {
      // Arrange
      const requestPayload = {
        content: "Comment content test",
      };

      const server = await createServer(container);
      await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "Comment content test",
      };

      const server = await createServer(container);

      const userId = await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 401 when request missing authentication", async () => {
      // Arrange
      const request = {
        commentId: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${request.threadId}/comments/${request.commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 403 when delete comment with invalid owner", async () => {
      // Arrange
      const request = {
        commentId: "comment-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);
      const userIdJohn = await ServerTestHelper.registerUser({
        server,
        username: "john",
      });
      const userIdSakti = await ServerTestHelper.registerUser({
        server,
        username: "sakti",
      });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      await ThreadTableTestHelper.addThread({ owner: userIdJohn });
      await CommentTableTestHelper.addComment({
        owner: userIdJohn,
        threadId: "thread-123",
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${request.threadId}/comments/${request.commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Anda tidak berhak mengakses resource ini"
      );
    });

    it("should response 404 when comment or thread not found", async () => {
      // Arrange
      const request = {
        commentId: "comment-123",
        threadId: "thread-123",
      };
      const server = await createServer(container);
      await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${request.threadId}/comments/${request.commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("comment tidak ditemukan");
    });

    it("should response 200 when comment deleted correctly", async () => {
      // Arrange
      const request = {
        commentId: "comment-123",
        threadId: "thread-123",
      };

      const server = await createServer(container);
      const userId = await ServerTestHelper.registerUser({ server });
      const accessToken = await ServerTestHelper.getAccessToken({ server });

      await ThreadTableTestHelper.addThread({
        id: request.threadId,
        owner: userId,
      });
      await CommentTableTestHelper.addComment({
        id: request.commentId,
        owner: userId,
        threadId: request.threadId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${request.threadId}/comments/${request.commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const comments =
        await CommentTableTestHelper.findCommentByIdIsDeleteFalse(
          request.commentId
        );
      const responseJson = JSON.parse(response.payload);
      expect(comments).toHaveLength(0);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});

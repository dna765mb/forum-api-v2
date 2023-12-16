const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123", username: "sakti" });
    await ThreadTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "Comment content test",
        owner: "user-123",
        threadId: "thread-123",
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments =
        await CommentTableTestHelper.findCommentByIdIsDeleteFalse(
          "comment-123",
        );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const newComment = new NewComment({
        content: "Comment content test",
        owner: "user-123",
        threadId: "thread-123",
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "Comment content test",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw NotFoundError when comment and thread not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(
          "comment-123",
          "thread-123",
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment and thread found", async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(
          "comment-123",
          "thread-123",
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyOwnerComment function", () => {
    it("should throw AuthorizationError when comment have invalid owner", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyOwnerComment(
          "comment-123",
          "invalid-user",
        ),
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment have valid owner", async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyOwnerComment("comment-123", "user-123"),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteCommentByCommentId function", () => {
    it("should delete comment by comment id correctly", async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action
      await commentRepositoryPostgres.deleteCommentByCommentId("comment-123");

      // Assert
      const comments =
        await CommentTableTestHelper.findCommentByIdIsDeleteFalse(
          "comment-123",
        );
      expect(comments).toHaveLength(0);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return empty array when not found comment in thread", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId,
      );

      // Assert
      expect(comments).toHaveLength(0);
    });

    it("should return all comment by thread id correctly", async () => {
      // Arrange
      const exampleComment1 = {
        id: "comment-123",
        owner: "user-123",
        threadId: "thread-123",
        content: "Comment content test",
        date: new Date("2023-10-26T15:34:43.671Z"),
      };

      const exampleComment2 = {
        id: "comment-124",
        owner: "user-123",
        threadId: "thread-123",
        content: "Comment content test",
        date: new Date("2023-10-26T16:34:43.671Z"),
      };
      await CommentTableTestHelper.addComment(exampleComment1);
      await CommentTableTestHelper.addComment(exampleComment2);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {},
      );

      // Action
      let comments = await commentRepositoryPostgres.getCommentsByThreadId(
        "thread-123",
      );

      comments = comments.map((comment) => ({
        ...comment,
        username: "sakti",
      }));

      // Assert
      expect(comments).toEqual([
        {
          id: exampleComment1.id,
          date: exampleComment1.date,
          content: exampleComment1.content,
          username: "sakti",
          is_delete: false,
        },
        {
          id: exampleComment2.id,
          date: exampleComment2.date,
          content: exampleComment2.content,
          username: "sakti",
          is_delete: false,
        },
      ]);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].username).toBeDefined();
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].is_delete).toBeDefined();
      expect(comments).toHaveLength(2);
    });
  });
});

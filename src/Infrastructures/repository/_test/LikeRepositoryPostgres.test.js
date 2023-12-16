const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: "user-123" });
    await ThreadTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
    await CommentTableTestHelper.addComment({
      id: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("likeComment function", () => {
    it("should add like comment correctly", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.likeComment("comment-123", "user-123");

      // Assert
      const likes = await CommentLikesTableTestHelper.verifyAvailableLike({
        commentId: "comment-123",
        owner: "user-123",
      });
      expect(likes).toHaveLength(1);
    });
  });

  describe("unlikeComment function", () => {
    it("should unlike comment correctly", async () => {
      // Arrange
      await CommentLikesTableTestHelper.likeComment({
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

      // Action
      await likeRepositoryPostgres.unlikeComment("comment-123", "user-123");

      // Assert
      const likes = await CommentLikesTableTestHelper.verifyAvailableLike({
        commentId: "comment-123",
        owner: "user-123",
      });
      expect(likes).toHaveLength(0);
    });
  });

  describe("verifyAvailableLike function", () => {
    it("should return rowCount correctly when like is available", async () => {
      // Arrange
      await CommentLikesTableTestHelper.likeComment({
        id: "comment_like-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

      // Action
      const rowCount = await likeRepositoryPostgres.verifyAvailableLike(
        "comment-123",
        "user-123",
      );

      // Assert
      expect(rowCount).toEqual(1);
    });

    it("should return rowCount correctly when like not available", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

      // Action
      const rowCount = await likeRepositoryPostgres.verifyAvailableLike(
        "comment-123",
        "user-123",
      );

      // Assert
      expect(rowCount).toEqual(0);
    });
  });

  describe("getTotalLikeComment function", () => {
    it("should return total like correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-124", username: "john" });

      await CommentLikesTableTestHelper.likeComment({
        id: "comment_like-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      await CommentLikesTableTestHelper.likeComment({
        id: "comment_like-124",
        commentId: "comment-123",
        owner: "user-124",
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, () => {});

      //   Action
      const totalLike = await likeRepositoryPostgres.getTotalLikeComment();

      // Assert
      expect(totalLike.length).toEqual(2);
    });
  });
});

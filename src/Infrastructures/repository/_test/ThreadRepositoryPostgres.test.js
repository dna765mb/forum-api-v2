const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread corerrecly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: "sakti",
        password: "secret",
      });
      const newThread = new NewThread({
        title: "Thread title test",
        body: "Thread body test",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: "sakti",
        password: "secret",
      });
      const newThread = new NewThread({
        title: "Thread title test",
        body: "Thread body test",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "Thread title test",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyAvailableThread function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadId = "thread-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread(threadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {},
      );

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getDetailThreadByThreadId function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadId = "thread-123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {},
      );

      // Action
      await expect(
        threadRepositoryPostgres.getDetailThreadByThreadId(threadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return detail thread correctly", async () => {
      // Arrange
      const threadId = "thread-123";
      const payloadThread = {
        id: threadId,
        owner: "user-123",
        title: "Thread title test",
        body: "Thread body test",
        date: new Date("2023-10-26T15:34:43.671Z"),
      };
      await UsersTableTestHelper.addUser({ id: "user-123", username: "sakti" });
      await ThreadTableTestHelper.addThread(payloadThread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {},
      );

      // Action
      const detailThread =
        await threadRepositoryPostgres.getDetailThreadByThreadId(threadId);

      // Assert
      expect(detailThread).not.toBeUndefined();
      expect(detailThread).toEqual({
        id: payloadThread.id,
        title: payloadThread.title,
        body: payloadThread.body,
        date: payloadThread.date,
        username: "sakti",
      });
      expect(detailThread.id).toBeDefined();
      expect(detailThread.title).toBeDefined();
      expect(detailThread.body).toBeDefined();
      expect(detailThread.date).toBeDefined();
      expect(detailThread.username).toBeDefined();
    });
  });
});

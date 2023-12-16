const DetailThread = require("../DetailThread");

describe("DetailThread entities", () => {
  it("should throw error when not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Thread title test",
      body: "Thread body test",
      date: "2021-08-08T07:19:09.775Z",
      username: "sakti",
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Thread title test",
      body: "Thread body test",
      date: "2021-08-08T07:19:09.775Z",
      username: "sakti",
      comments: "comment",
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DetailThread entities correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Thread title test",
      body: "Thread body test",
      date: "2021-08-08T07:19:09.775Z",
      username: "sakti",
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toBeDefined();
    expect(detailThread.title).toBeDefined();
    expect(detailThread.body).toBeDefined();
    expect(detailThread.date).toBeDefined();
    expect(detailThread.username).toBeDefined();
    expect(detailThread.comments).toBeDefined();
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});

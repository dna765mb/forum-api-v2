const NewComment = require("../NewComment");

describe("NewComment entities", () => {
  it("should throw error when not contain needed property", async () => {
    // Arrange
    const payload = {
      content: "Comment content test",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when not meet data type specification", async () => {
    // Arrange
    const payload = {
      content: "Comment content test",
      owner: "user-123",
      threadId: 123,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create new comment entities correctly", () => {
    // Arrange
    const payload = {
      content: "Comment content test",
      owner: "user-123",
      threadId: "Thread-123",
    };

    // Action
    const newComment = new NewComment(payload);

    //   Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.content).toBeDefined();
    expect(newComment.owner).toBeDefined();
    expect(newComment.threadId).toBeDefined();
  });
});

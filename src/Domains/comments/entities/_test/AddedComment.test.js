const AddedComment = require("../AddedComment");

describe("AddedComment entities", () => {
  it("should throw error when not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Comment content test",
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Comment content test",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create added comment entities correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Comment content test",
      owner: "user-123",
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
    expect(addedComment.id).toBeDefined();
    expect(addedComment.content).toBeDefined();
    expect(addedComment.owner).toBeDefined();
  });
});

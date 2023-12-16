const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");

describe("AddCommentReplyUseCase", () => {
  it("should orchestrating the add comment reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      content: "content reply comment",
      owner: "user-123",
    };

    const expectedAddedReply = {
      id: "reply-123",
      content: "content reply comment",
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addCommentReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedReply({
          id: "reply-123",
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        }),
      ),
    );

    const addCommentReply = new AddCommentReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addCommentReply.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply(expectedAddedReply));
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.addCommentReply).toBeCalledWith(
      new NewReply(useCasePayload),
    );
  });
});

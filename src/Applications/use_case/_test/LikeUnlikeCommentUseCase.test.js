const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeUnlikeCommentUseCase = require("../LikeUnlikeCommentUseCase");

describe("LikeUnlikeCommentUseCase", () => {
  it("should orchestrating unlike action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommmentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommmentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve(),
    );
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommmentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommmentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.unlikeComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.unlikeComment).toBeCalledTimes(1);
  });

  it("should orchestrating like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommmentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve(),
    );
    mockCommmentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve(),
    );
    mockLikeRepository.verifyAvailableLike = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.likeComment = jest.fn(() => Promise.resolve());

    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommmentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommmentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.likeComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockLikeRepository.likeComment).toBeCalledTimes(1);
  });
});

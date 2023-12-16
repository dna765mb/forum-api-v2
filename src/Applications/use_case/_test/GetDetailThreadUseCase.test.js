const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");

describe("GetDetailThreadUseCase", () => {
  it("should orchestrating the get detail thread action correctly", async () => {
    // Arrange
    const useCasePayload = "thread-123";
    const thread = {
      id: "thread-123",
      title: "Thread title test",
      body: "Thread body test",
      date: "2021-08-08T07:19:09.775Z",
      username: "sakti",
    };

    const comments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
        is_delete: false,
      },
    ];

    const replies = [
      {
        id: "reply-123",
        content: "content reply comment",
        date: "2021-08-08T07:59:48.766Z",
        username: "sakti",
        comment_id: "comment-123",
        is_delete: false,
      },
    ];

    const expectedReplies = replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      date: reply.date,
      username: reply.username,
    }));

    const expectedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      replies: expectedReplies,
      likeCount: 2,
    }));

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getDetailThreadByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: "thread-123",
          title: "Thread title test",
          body: "Thread body test",
          date: "2021-08-08T07:19:09.775Z",
          username: "sakti",
        }),
      );

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-123",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            is_delete: false,
          },
        ]),
      );
    mockReplyRepository.getRepliesCommentByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "reply-123",
            content: "content reply comment",
            date: "2021-08-08T07:59:48.766Z",
            username: "sakti",
            comment_id: "comment-123",
            is_delete: false,
          },
        ]),
      );

    mockLikeRepository.getTotalLikeComment = jest.fn(() =>
      Promise.resolve([
        {
          comment_id: "comment-123",
        },
        {
          comment_id: "comment-123",
        },
      ]),
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toEqual({
      ...thread,
      comments: expectedComments,
    });
    expect(mockThreadRepository.getDetailThreadByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockReplyRepository.getRepliesCommentByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockThreadRepository.getDetailThreadByThreadId).toBeCalledTimes(1);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesCommentByThreadId).toBeCalledTimes(1);
    expect(mockLikeRepository.getTotalLikeComment).toBeCalledTimes(1);
  });

  it("should return deleted comment correctly", async () => {
    // Arrange
    const useCasePayload = "thread-123";
    const thread = {
      id: "thread-123",
      title: "Thread title test",
      body: "Thread body test",
      date: "2021-08-08T07:19:09.775Z",
      username: "sakti",
    };

    const comments = [
      {
        id: "comment-123",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "**komentar telah dihapus**",
        is_delete: true,
      },
    ];

    const replies = [
      {
        id: "reply-123",
        date: "2021-08-08T07:59:48.766Z",
        username: "sakti",
        comment_id: "comment-123",
        content: "**balasan telah dihapus**",
        is_delete: true,
      },
    ];

    const expectedReplies = replies.map(
      ({ comment_id, is_delete, ...otherProperties }) => otherProperties,
    );
    const expectedComments = comments.map(
      ({ is_delete, ...otherProperties }) => ({
        ...otherProperties,
        replies: expectedReplies,
        likeCount: 2,
      }),
    );

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getDetailThreadByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: "thread-123",
          title: "Thread title test",
          body: "Thread body test",
          date: "2021-08-08T07:19:09.775Z",
          username: "sakti",
        }),
      );

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-123",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "content comment test",
            is_delete: true,
          },
        ]),
      );
    mockReplyRepository.getRepliesCommentByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "reply-123",
            comment_id: "comment-123",
            date: "2021-08-08T07:59:48.766Z",
            username: "sakti",
            content: "content reply comment test",
            is_delete: true,
          },
        ]),
      );

    mockLikeRepository.getTotalLikeComment = jest.fn(() =>
      Promise.resolve([
        {
          comment_id: "comment-123",
        },
        {
          comment_id: "comment-123",
        },
      ]),
    );

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toEqual({
      ...thread,
      comments: expectedComments,
    });
    expect(mockThreadRepository.getDetailThreadByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockReplyRepository.getRepliesCommentByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockThreadRepository.getDetailThreadByThreadId).toBeCalledTimes(1);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesCommentByThreadId).toBeCalledTimes(1);
    expect(mockLikeRepository.getTotalLikeComment).toBeCalledTimes(1);
  });
});

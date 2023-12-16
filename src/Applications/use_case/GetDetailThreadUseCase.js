class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;
    const thread = await this._threadRepository.getDetailThreadByThreadId(
      threadId,
    );
    let comments = await this._commentRepository.getCommentsByThreadId(
      threadId,
    );
    const replies = await this._replyRepository.getRepliesCommentByThreadId(
      threadId,
    );

    const likes = await this._likeRepository.getTotalLikeComment();
    const totalLikes = (likes, commentId) => {
      const likeCount = likes.filter(
        ({ comment_id }) => comment_id === commentId,
      );
      return likeCount.length;
    };

    const repliesComment = (replies, commentId) => {
      let results = [...replies];
      results = results.filter((reply) => reply.comment_id === commentId);
      results = results.map((reply) => ({
        id: reply.id,
        content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
        date: reply.date,
        username: reply.username,
      }));
      return results;
    };

    comments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      replies: repliesComment(replies, comment.id),
      content: comment.is_delete
        ? "**komentar telah dihapus**"
        : comment.content,
      likeCount: totalLikes(likes, comment.id),
    }));

    return { ...thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;

class LikeUnlikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId, threadId);
    const rowCount = await this._likeRepository.verifyAvailableLike(
      commentId,
      owner,
    );

    if (rowCount) {
      await this._likeRepository.unlikeComment(commentId, owner);
      return;
    }
    await this._likeRepository.likeComment(commentId, owner);
  }
}

module.exports = LikeUnlikeCommentUseCase;

class DeleteCommentReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;
    await this._commentRepository.verifyAvailableComment(commentId, threadId);
    await this._replyRepository.verifyAvailableCommentReply(replyId);
    await this._replyRepository.verifyOwnerCommentReply(replyId, owner);

    await this._replyRepository.deleteCommentReplyByReplyId(replyId);
  }
}

module.exports = DeleteCommentReplyUseCase;

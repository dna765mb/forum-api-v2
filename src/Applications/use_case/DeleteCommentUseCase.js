class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId, owner, threadId } = useCasePayload;
    await this._commentRepository.verifyAvailableComment(commentId, threadId);
    await this._commentRepository.verifyOwnerComment(commentId, owner);

    await this._commentRepository.deleteCommentByCommentId(commentId);
  }
}

module.exports = DeleteCommentUseCase;

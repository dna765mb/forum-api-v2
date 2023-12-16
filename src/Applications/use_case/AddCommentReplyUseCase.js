const AddedReply = require("../../Domains/replies/entities/AddedReply");
const NewReply = require("../../Domains/replies/entities/NewReply");

class AddCommentReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.verifyAvailableComment(
      newReply.commentId,
      newReply.threadId
    );
    const addedReply = await this._replyRepository.addCommentReply(newReply);

    return new AddedReply(addedReply);
  }
}

module.exports = AddCommentReplyUseCase;

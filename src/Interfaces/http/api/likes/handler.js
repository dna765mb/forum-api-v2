const LikeUnlikeCommentUseCase = require("../../../../Applications/use_case/LikeUnlikeCommentUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request, h) {
    const likeUnlikeCommentUseCase = this._container.getInstance(
      LikeUnlikeCommentUseCase.name,
    );
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
    };
    await likeUnlikeCommentUseCase.execute(useCasePayload);

    return { status: "success" };
  }
}

module.exports = LikesHandler;

const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentByThreadIdHandler =
      this.postCommentByThreadIdHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentByThreadIdHandler(request, h) {
    const useCasePayload = {
      content: request.payload.content,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const useCasePayload = {
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    };
    await deleteCommentUseCase.execute(useCasePayload);

    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}

module.exports = CommentsHandler;

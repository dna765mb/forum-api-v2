const AddCommentReplyUseCase = require("../../../../Applications/use_case/AddCommentReplyUseCase");
const DeleteCommentReplyUseCase = require("../../../../Applications/use_case/DeleteCommentReplyUseCase");
const pool = require("../../../../Infrastructures/database/postgres/pool");
const CommentRepositoryPostgres = require("../../../../Infrastructures/repository/CommentRepositoryPostgres");
const ReplyRepositoryPostgres = require("../../../../Infrastructures/repository/ReplyRepositoryPostgres");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyCommentHandler = this.postReplyCommentHandler.bind(this);
    this.deleteReplyCommentHandler = this.deleteReplyCommentHandler.bind(this);
  }

  async postReplyCommentHandler(request, h) {
    const addCommentReplyUseCase = this._container.getInstance(
      AddCommentReplyUseCase.name
    );
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      content: request.payload.content,
      owner: request.auth.credentials.id,
    };
    const addedReply = await addCommentReplyUseCase.execute(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedReply,
        },
      })
      .code(201);
  }

  async deleteReplyCommentHandler(request, h) {
    const deleteCommentReplyUseCase = this._container.getInstance(
      DeleteCommentReplyUseCase.name
    );
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
      owner: request.auth.credentials.id,
    };

    await deleteCommentReplyUseCase.execute(useCasePayload);

    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}

module.exports = RepliesHandler;

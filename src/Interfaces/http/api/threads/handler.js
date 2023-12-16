const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetDetailThreadUseCase = require("../../../../Applications/use_case/GetDetailThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadByIdHandler =
      this.getDetailThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const useCasePayload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    return h
      .response({
        status: "success",
        data: {
          addedThread,
        },
      })
      .code(201);
  }

  async getDetailThreadByIdHandler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    );
    const thread = await getDetailThreadUseCase.execute(
      request.params.threadId
    );

    return h
      .response({
        status: "success",
        data: {
          thread,
        },
      })
      .code(200);
  }
}

module.exports = ThreadsHandler;

const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "title",
      body: "body",
      owner: "user-123",
    };

    const newAddedThread = new AddedThread({
      id: "thread-123",
      title: "title",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: "thread-123",
          title: "title",
          owner: "user-123",
        })
      )
    );

    const addedThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await addedThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(newAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: "title",
        body: "body",
        owner: "user-123",
      })
    );
  });
});

const LikeRepository = require("../LikeRepository");

describe("a LikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.likeComment("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(likeRepository.unlikeComment("", "")).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(
      likeRepository.verifyAvailableLike("", ""),
    ).rejects.toThrowError("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(likeRepository.getTotalLikeComment()).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});

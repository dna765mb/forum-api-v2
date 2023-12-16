/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async likeComment({
    id = "comment_like-123",
    commentId = "comment-123",
    owner = "user-123",
    date = "2023-10-26T15:34:43.671Z",
  }) {
    const query = {
      text: "INSERT INTO comment_likes VALUES ($1, $2, $3, $4)",
      values: [id, commentId, owner, date],
    };

    await pool.query(query);
  },

  async unlikeComment({ commentId = "comment-123", owner = "user-123" }) {
    const query = {
      text: "DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    await pool.query(query);
  },

  async verifyAvailableLike({ commentId = "comment-123", owner = "user-123" }) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE comment_id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_likes WHERE 1=1");
  },
};

module.exports = CommentLikesTableTestHelper;

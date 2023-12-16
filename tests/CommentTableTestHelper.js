/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentTableTestHelper = {
  async addComment({
    id = "comment-123",
    content = "Comment content test",
    owner = "user-123",
    threadId = "thread-123",
    date = "2023-10-26T15:34:43.671Z",
    isDelete = false,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)",
      values: [id, content, owner, threadId, date, isDelete],
    };

    await pool.query(query);
  },

  async findCommentByIdIsDeleteFalse(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND is_delete = FALSE",
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsByThreadId(threadId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentTableTestHelper;

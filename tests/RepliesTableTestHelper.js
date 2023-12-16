/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    content = "content reply comment",
    owner = "user-123",
    threadId = "thread-123",
    commentId = "comment-123",
    date = "2021-08-08T07:59:16.198Z",
  }) {
    const query = {
      text: "INSERT INTO comment_replies VALUES ($1, $2, $3, $4, $5, $6)",
      values: [id, content, owner, threadId, commentId, date],
    };

    await pool.query(query);
  },

  async findReplyByIdIsDeleteFalse(replyId) {
    const query = {
      text: "SELECT * FROM comment_replies WHERE id = $1 AND is_delete = FALSE",
      values: [replyId],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;

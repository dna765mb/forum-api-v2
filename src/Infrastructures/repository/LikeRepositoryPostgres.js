const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(commentId, owner) {
    const id = `comment_like-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: "INSERT INTO comment_likes VALUES($1, $2, $3, $4)",
      values: [id, commentId, owner, date],
    };
    await this._pool.query(query);
  }

  async unlikeComment(commentId, owner) {
    const query = {
      text: "DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyAvailableLike(commentId, owner) {
    const query = {
      text: "SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2",
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);
    return rowCount;
  }

  async getTotalLikeComment() {
    const result = await this._pool.query(
      "SELECT comment_id FROM comment_likes",
    );
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;

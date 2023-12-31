const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getDetailThreadByThreadId(threadId) {
    const query = {
      text: "SELECT t.id, t.title, t.body, t.date, u.username FROM threads t join users u on t.owner = u.id WHERE t.id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;

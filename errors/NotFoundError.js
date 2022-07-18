class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "Not Found";
    this.statusCode = 404;
  }
}

module.exports = { NotFoundError };

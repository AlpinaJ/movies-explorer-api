class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "Bad Request";
    this.statusCode = 400;
  }
}

module.exports = { BadRequestError };

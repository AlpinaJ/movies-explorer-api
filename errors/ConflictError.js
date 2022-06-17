class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "Conflict";
    this.statusCode = 401;
  }
}

module.exports = { ConflictError };

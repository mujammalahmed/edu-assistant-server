class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serialize() {
    throw new Error("Method 'serialize' must be implemented.");
  }
}

module.exports = { CustomError };

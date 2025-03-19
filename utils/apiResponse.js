class ApiResponse {
  constructor(res, statusCode, message, data = {}) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;

    res.status(this.statusCode).json({
      message: this.message,
      data: this.data,
      success: this.success,
    });
  }
}

module.exports = { ApiResponse };

class NotFoundError extends Error {
    constructor(message = 'Resource not found', statusCode = 404) {
      super(message);
      this.statusCode = statusCode;
      this.status = 'failed';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = NotFoundError;
  
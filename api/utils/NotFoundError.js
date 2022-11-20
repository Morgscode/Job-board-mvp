class NotFoundError extends Error {
    constructor(message = 'resource not found', statusCode = 404) {
      super(message);
      this.statusCode = statusCode;
      this.status = 'failed';
      this.isOperational = false;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = NotFoundError;
  
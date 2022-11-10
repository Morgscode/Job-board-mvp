class NotFoundError extends Error {
    constructor(message = 'no resources found', statusCode = 404) {
      super(message);
      this.statusCode = statusCode;
      this.status = 'failed';
      this.isOperational = false;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = NotFoundError;
  
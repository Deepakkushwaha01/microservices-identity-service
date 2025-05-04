import express from 'express'
import logger from '../logs/logger'

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err.stack)

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  })
}

export default errorHandler
// This error handler middleware is used to catch errors that occur during the request-response cycle
// and send a JSON response with the error message and status code.
// It logs the error stack for debugging purposes and sends a response with the appropriate status code
// and message.
// It is typically placed at the end of the middleware stack in an Express application.
// This allows it to catch any errors that were not handled by previous middleware or route handlers.

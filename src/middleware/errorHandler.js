import {
  isOperationalError,
} from '../utils/errors';

/**
 * Creates an error object that is save to expose, any internal data on the error
 * is not returned to the client, only in the case of a ValidationError is the cause
 * exposed as a "details" property
 * @param error
 * @returns {{}}
 */
const createResponseError = (error) => {
  const err = {};
  if (isOperationalError(error)) {
    err.status = error.status;
    err.message = error.message;
  } else {
    err.status = 500;
    err.message = 'Internal Server Error';
  }

  return err;
};

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (isOperationalError(err)) {
    const error = createResponseError(err);

    res.status(error.status).json({ error });
  } else {
    next(err); // Uncaught / unknown error handlers are processed by the UnknownErrorHandler
  }
};

export default errorHandler;

/*
 * Errors here are used as return error for our api.
 * They should comply to the Open API specs
 * https://github.com/OAI/OpenAPI-Specification
 */

const errorFactory = (name, defaultMessage, status) =>
  ({ message, details, cause, ...meta } = {}) => {
    const error = new Error(message || defaultMessage);

    error.__operational_error__ = true;
    error.status = status;
    error.name = name;
    error.details = details;
    error.cause = cause;

    error.meta = meta;

    return error;
  };

export const serverError = errorFactory('ServerError', 'Internal Server Error', 500);
export const notFoundError = errorFactory('NotFoundError', 'Not Found', 404);

export const isOperationalError = error => error.__operational_error__;

const checkErrorType = name => error => error.name === name;

export const isServerError = checkErrorType('ServerError');
export const isNotFoundError = checkErrorType('NotFoundError');

'use strict';

const { sendError } = require('../utils/apiResponse');

/**
 * validate(schema) — Zod validation middleware factory.
 * Validates req.body against the provided Zod schema.
 * On success: attaches req.validatedBody with typed/coerced data.
 * On failure: returns 422 with field-level errors.
 *
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source - Where to validate (default: 'body')
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.errors.reduce((acc, err) => {
        const field = err.path.join('.');
        acc[field] = err.message;
        return acc;
      }, {});

      return sendError(res, {
        status: 422,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      });
    }

    req.validatedBody = result.data;
    next();
  };
}

module.exports = validate;

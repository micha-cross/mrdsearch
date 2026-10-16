import type { ErrorRequestHandler, RequestHandler } from 'express'
import type { ErrorResponse } from '../types.ts'

/** An error that is safe to show the caller, with the HTTP status to send */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: string[],
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

/** Catches requests that no route handled */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, 'NOT_FOUND', `No route for ${req.method} ${req.path}`))
}

/** Errors thrown by express.json(), e.g. malformed JSON or an oversized body */
interface BodyParserError extends Error {
  type: string
  status: number
}

function isBodyParserError(err: unknown): err is BodyParserError {
  return err instanceof Error && typeof (err as BodyParserError).type === 'string' && 'status' in err
}

function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err
  if (isBodyParserError(err)) {
    return err.type === 'entity.parse.failed'
      ? new HttpError(400, 'INVALID_JSON', 'Request body is not valid JSON')
      : new HttpError(err.status, 'BAD_REQUEST', err.message)
  }
  return new HttpError(500, 'INTERNAL_ERROR', 'Something went wrong')
}

/**
 * Turns any error into the { error: { code, message, details? } } shape. Express 5 forwards
 * rejected async handlers here, so routes can simply throw. Unexpected errors are logged
 * in full but the caller only gets a generic message, never a stack trace
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err)

  const httpError = toHttpError(err)
  if (httpError.status >= 500) console.error(`${req.method} ${req.path} failed:`, err)

  const body: ErrorResponse = {
    error: { code: httpError.code, message: httpError.message, details: httpError.details },
  }
  res.status(httpError.status).json(body)
}

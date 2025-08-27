import { ErrorRequestHandler, NextFunction, Response, Request } from 'express'
import Boom from '@hapi/boom'

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Boom.isBoom(err)) {
    let { output, data } = err

    if (data?.errors) output.payload.errors = data.errors
    return res.status(output.statusCode).json(output.payload)
  }

  return res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: err.stack,
  })
}

export const logErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  next(err)
}
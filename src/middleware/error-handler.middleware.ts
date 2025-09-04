import { ErrorRequestHandler, NextFunction, Response, Request } from 'express'
import Boom from '@hapi/boom'
import { JsonWebTokenError } from 'jsonwebtoken'
import multer from 'multer'

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

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido',
    })
  }

  return res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: err.stack,
  })
}

export const logErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)
  next(err)
}

export function multerErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    return Boom.badRequest(err.message)
  } else if (err) {
    return Boom.internal(err.message)
  }
  next()
}

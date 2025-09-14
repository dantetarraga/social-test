import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'
import boom from '@hapi/boom'

type RequestProperty = 'body' | 'params' | 'query'

export const validateSchema = (schema: ZodType, property: RequestProperty = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[property]
    
    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return next(boom.badRequest('Validation error', { errors }))
    }

    req[property] = result.data

    next()
  }
}

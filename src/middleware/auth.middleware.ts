import { Response, NextFunction, Request } from 'express'
import Boom from '@hapi/boom'
import { verifyToken } from '@/helpers'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) throw Boom.unauthorized('Token de acceso requerido')

  const decoded = verifyToken(token)
  if (!decoded) throw Boom.unauthorized('Token de acceso inválido')

  req.user = decoded
  next()
}

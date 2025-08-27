import { PostController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'
import { createPostSchema } from '@/schema'
import { Router } from 'express'

const postRouter = Router()

postRouter.post(
  '/',
  authenticateToken,
  validateSchema(createPostSchema, 'body'),
  PostController.createPost
)

export default postRouter
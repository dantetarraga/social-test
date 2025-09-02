import { PostController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'
import { createPostSchema } from '@/schema'
import { Router } from 'express'

const postRouter = Router()

import multer from "multer"

const upload = multer({ dest: "uploads/posts" })

postRouter.post(
  '',
  authenticateToken,
  upload.array("media"),
  // validateSchema(createPostSchema, 'body'),
  PostController.createPost
)

export default postRouter
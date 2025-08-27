import { Router } from 'express'

import { createProfileSchema } from '@/schema'
import { ProfileController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'

const profileRouter = Router()

profileRouter.post(
  '',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.createProfile
)

profileRouter.get(
  '',
  authenticateToken,
  ProfileController.listProfiles
)

profileRouter.get(
  '/:id',
  authenticateToken,
  ProfileController.getProfile
)

profileRouter.delete(
  '/:id',
  authenticateToken,
  ProfileController.deleteProfile
)

profileRouter.put(
  '/:id',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.editProfile
)

export default profileRouter

import { Router } from 'express'

import { ProfileController } from '@/controllers'
import { authenticateToken, validateSchema } from '@/middleware'

import {
  connectionParamsSchema,
  createProfileSchema,
  profileIdSchema,
} from '@/schemas'

const router = Router()

router.post(
  '',
  authenticateToken,
  validateSchema(createProfileSchema, 'body'),
  ProfileController.createProfile
)

router.put(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  validateSchema(createProfileSchema, 'body'),
  ProfileController.editProfile
)

router.get('', authenticateToken, ProfileController.listProfiles)

router.get(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.getProfileById
)

router.get(
  '/:profileId/connections',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.getConnectionsByProfile
)

router.get(
  '/:profileId/posts',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.getPostsByProfile
)

router.delete(
  '/:profileId',
  authenticateToken,
  validateSchema(profileIdSchema, 'params'),
  ProfileController.deleteProfile
)

router.delete(
  '/:profileId/connections/:connectionId',
  authenticateToken,
  validateSchema(connectionParamsSchema, 'params'),
  ProfileController.deleteConnection
)

export default router

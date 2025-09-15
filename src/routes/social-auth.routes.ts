import { SocialAuthController } from "@/controllers";
import { Router } from "express";

const router = Router()

router.post('/', SocialAuthController.generateAuthUrl)
router.get('/:platform/callback', SocialAuthController.handleCallback)

export default router

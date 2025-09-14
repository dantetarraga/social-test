import express from "express";
import { Router } from "express";

import authRouter from "./auth.routes";
import postRouter from "./post.routes";
import profileRouter from "./profile.routes";


function routerApi(app: express.Application) {
  const router = Router()

  app.use('/api', router)

  router.use('/auth', authRouter)
  router.use('/profiles', profileRouter)
  router.use('/posts', postRouter)
}

export default routerApi
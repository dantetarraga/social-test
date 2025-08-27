import express from "express";
import { Router } from "express";

import authRouter from "./auth.route";
import profileRouter from "./profile.route";
import postRouter from "./post.route";


function routerApi(app: express.Application) {
  const router = Router()

  app.use('/api', router)

  router.use('/auth', authRouter)
  router.use('/profiles', profileRouter)
  router.use('/posts', postRouter)
}

export default routerApi
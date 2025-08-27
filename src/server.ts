import cors from 'cors'
import express from 'express'
import cookieParser from "cookie-parser";

import routerApi from './routes'
import { errorHandler, logErrors } from './middleware'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Router
routerApi(app)

// Error handling middleware
app.use(errorHandler)
app.use(logErrors)

export default app
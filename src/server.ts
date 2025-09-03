import cors from 'cors'
import express from 'express'
import cookieParser from "cookie-parser";
import path from "path";

import routerApi from './routes'
import { errorHandler, logErrors } from './middleware'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Router
routerApi(app)

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Error handling middleware
app.use(errorHandler)
app.use(logErrors)

export default app
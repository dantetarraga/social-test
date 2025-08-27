import express from 'express'
import routerApi from './routes'
import { errorHandler, logErrors } from './middleware'

const app = express()

app.use(express.json())

// Router
routerApi(app)

// Error handling middleware
app.use(errorHandler)
app.use(logErrors)

export default app
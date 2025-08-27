import app from '@/server'
import { AppDataSource } from './config/database'

const PORT = process.env.APP_PORT || 4000

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to the database', error)
  })


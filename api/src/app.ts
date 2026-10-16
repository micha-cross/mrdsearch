import express from 'express'
import { errorHandler, notFoundHandler } from './http/errors.ts'
import { allowedOriginsOnly } from './http/origins.ts'
import { productsRouter } from './routes/products.ts'

export const app = express()

app.use(allowedOriginsOnly)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use(productsRouter)

// Must come after every route
app.use(notFoundHandler)
app.use(errorHandler)

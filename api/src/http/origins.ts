import cors from 'cors'
import { HttpError } from './errors.ts'

const allowedOrigins = ['http://localhost:5173'] // TODO - make env variable. This is fine for local demo (parseAllowedOrigins())

export function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]): boolean {
  return !origin || allowedOrigins.includes(origin)
}

export const allowedOriginsOnly = cors({
  origin: (origin, callback) =>
    isOriginAllowed(origin, allowedOrigins)
      ? callback(null, true)
      : callback(new HttpError(403, 'ORIGIN_NOT_ALLOWED', `Origin ${origin} is not allowed`)),
})

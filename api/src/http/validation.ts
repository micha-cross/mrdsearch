import type { ProductRequest, ProductSort, SortOrder } from '../types.ts'
import { HttpError } from './errors.ts'

const SORTS: readonly ProductSort[] = ['rating', 'price']
const ORDERS: readonly SortOrder[] = ['asc', 'desc']

const isString = (value: unknown): value is string => typeof value === 'string'

/** Checks the POST /api/products body and throws a 400 listing every invalid field */
export function parseProductRequest(body: unknown): ProductRequest {
  if (body === undefined) return {}
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'INVALID_REQUEST', 'Request body must be a JSON object')
  }

  const { query, category, sort, order } = body as Record<string, unknown>
  const problems: string[] = []

  if (query !== undefined && !isString(query)) problems.push('query must be a string')
  if (category !== undefined && !isString(category) && !(Array.isArray(category) && category.every(isString))) {
    problems.push('category must be a string or an array of strings')
  }
  if (sort !== undefined && !SORTS.includes(sort as ProductSort)) {
    problems.push(`sort must be one of: ${SORTS.join(', ')}`)
  }
  if (order !== undefined && !ORDERS.includes(order as SortOrder)) {
    problems.push(`order must be one of: ${ORDERS.join(', ')}`)
  }

  if (problems.length > 0) {
    throw new HttpError(400, 'INVALID_REQUEST', 'Invalid search request', problems)
  }
  return { query, category, sort, order } as ProductRequest
}

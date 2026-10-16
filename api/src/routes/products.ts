import { type Request, type Response, Router } from 'express'
import type { Product, ProductCategoriesResponse, ProductRequest, ProductResponse, ProductSort } from '../types.ts'
import { ProductCrud } from '../crud/product.ts'
import { ProductService } from '../service/product-service.ts'
import { parseProductRequest } from '../http/validation.ts'
import { productSearchRateLimit } from '../http/rate-limit.ts'

export const productsRouter = Router()


// POST /api/products  { "query": "bread", "category": "Bakery", "sort": "popularity", "order": "desc" }
productsRouter.post(
  '/api/products',
  productSearchRateLimit,
  async (req: Request<{}, ProductResponse, unknown>, res: Response<ProductResponse>) => {
    // Throws a 400 HttpError for an invalid body; the error middleware sends it
    const { query, category, sort, order } = parseProductRequest(req.body)
    const results = await new ProductService().loadAndProcessProducts({
      query,
      category,
      sort,
      order,
    })

    res.json(results)
  },
)


productsRouter.get(
  '/api/products/categories',
  (req: Request<{}>, res: Response<ProductCategoriesResponse>) => {
    const results = new ProductCrud().getCategories();
    res.json(results)
  },
)
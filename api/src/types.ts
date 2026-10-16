export interface Product {
  id: number
  name: string
  category: string
  /** Popularity rating from 1 to 5, one decimal place */
  rating: number
}

export type ProductSort = 'rating' | 'price'

export type SortOrder = 'asc' | 'desc'

/** JSON body of POST /api/products. Every field is optional. */
export interface ProductRequest {
  query?: string
  /** One category or several; a product matches if it is in any of them */
  category?: string | string[]
  sort?: ProductSort
  /** Defaults to 'desc' */
  order?: SortOrder
}

/** Body of every error response */
export interface ErrorResponse {
  error: {
    /** Stable, machine-readable, e.g. INVALID_REQUEST or NOT_FOUND */
    code: string
    message: string
    /** Per-field problems for a 400 */
    details?: string[]
  }
}

export type ProductResponse = ProductWithInfo[] | ErrorResponse

export type ProductCategoriesResponse = string[] | ErrorResponse

/** Price and availability from the downstream product service, matched to a Product by id */
export interface ProductInfo {
  id: number
  /** Price in USD */
  price: number
  available: boolean
}

export interface ProductWithInfo {
  id: number
  name: string
  category: string
  /** Popularity rating from 1 to 5, one decimal place */
  rating: number
  /** null when the downstream product service failed - could have made this a payload 
   * with a flag to tell why the downstream didn't return info but opted to keep simple */
  product_info: ProductInfo | null
}

/** Mirrors Product in api/src/types.ts */
export interface ProductInfo {
  id: number
  /** Price in USD */
  price: number
  available: boolean
}

export interface Product {
  id: number
  name: string
  category: string
  /** Popularity rating from 1 to 5, one decimal place */
  rating: number
  /** null when the downstream product service failed */
  product_info: ProductInfo | null
}


/** Mirrors ProductRequest in api/src/types.ts */
export interface ProductRequest {
  query?: string
  category?: string | string[]
  sort?: ProductSort
  /** Defaults to 'desc' */
  order?: SortOrder
}

export type ProductSort = 'rating' | 'price'

export type SortOrder = 'asc' | 'desc'

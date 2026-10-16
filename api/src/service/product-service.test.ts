import { describe, expect, it } from 'vitest'
import type { Product, ProductInfo } from '../types.ts'
import { ProductRepo } from '../crud/product.ts'
import { DownstreamProvider } from '../integrations/product-info.ts'
import { ProductService } from './product-service.ts'

const products: Product[] = [
  { id: 1, name: 'Sourdough Loaf', category: 'Bakery', rating: 4.6 },
  { id: 2, name: 'Flat White', category: 'Coffee', rating: 4.8 },
  { id: 3, name: 'Croissant', category: 'Bakery', rating: 4.2 },
]

const productInfo: ProductInfo[] = [
  { id: 1, price: 5.49, available: true },
  { id: 2, price: 3.75, available: false },
  // Entry 3 is for downstream failure
]

const fakeProductSource: ProductRepo = {
  searchProducts: async () => products,
}

const fakeProductInfoProvider: DownstreamProvider = {
  getProductInfo: async (id) => {
    const info = productInfo.find((info) => info.id === id)
    if (!info) throw new Error(`Downstream failed for product ${id}`)
    return info
  },
}

describe('ProductService.loadAndProcessProducts', () => {
  const service = new ProductService(fakeProductSource, fakeProductInfoProvider)

  it('enriches each product, using null when the downstream fails', async () => {
    const results = await service.loadAndProcessProducts({})

    expect(results.map((p) => [p.id, p.product_info])).toEqual([
      [1, { id: 1, price: 5.49, available: true }],
      [2, { id: 2, price: 3.75, available: false }],
      [3, null],
    ])
  })

  it('sorts by price ascending with unpriced products last', async () => {
    const results = await service.loadAndProcessProducts({ sort: 'price', order: 'asc' })

    expect(results.map((p) => p.id)).toEqual([2, 1, 3])
  })
})

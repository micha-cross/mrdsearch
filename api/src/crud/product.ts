import { Product, ProductSort, ProductWithInfo, SortOrder } from "../types.ts"
import products from '../data/products.json' with { type: 'json' }
import { DownstreamProvider } from "../integrations/product-info.ts"

export interface ProductRepo {
    searchProducts(search: { query?: string, category?: string | string[] }): Promise<Product[]>
}

const allProducts: Product[] = products


export class ProductCrud implements ProductRepo {

    public async searchProducts(search: {
        query?: string
        category?: string | string[]
    }) {

        const { query, category } = search ?? {}


        const searchText = typeof query === 'string' ? query.trim().toLowerCase() : ''
        const cats = (Array.isArray(category) ? category : [category])
            .filter((c): c is string => typeof c === 'string' && c.trim() !== '')
            .map((c) => c.trim().toLowerCase())


        let filteredProducts = allProducts.filter(
            (product) =>
                (!searchText || product.name.toLowerCase().includes(searchText) || product.category.toLowerCase().includes(searchText)) &&
                (cats.length === 0 || cats.includes(product.category.toLowerCase())),
        )

        return filteredProducts;
    }

    public getCategories() {
        const categories = new Set<string>();
        allProducts.forEach((product) => {
            categories.add(product.category);
        })
        return [...categories]
    }


}



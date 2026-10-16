import { ProductCrud, ProductRepo } from "../crud/product.ts";
import { DownstreamProvider, ProductInfoProvider } from "../integrations/product-info.ts";
import { Product, ProductInfo, ProductSort, ProductWithInfo, SortOrder } from "../types.ts";


export class ProductService {

    constructor(
        private readonly productSource: ProductRepo = new ProductCrud(),
        private readonly productInfoProvider: DownstreamProvider = new ProductInfoProvider(),
    ) { }

    public async loadAndProcessProducts(search: {
        query?: string
        category?: string | string[]
        sort?: ProductSort
        order?: SortOrder
    }) {

        const { query, category, sort, order } = search ?? {}


        const products = await this.productSource.searchProducts({
            query,
            category,
        })

        let results = await this.processProductInfo(products);

        if (sort === "rating") {
            const direction = order === 'asc' ? 1 : -1
            results = [...results].sort((a, b) => direction * (a.rating - b.rating))
        }
        else if (sort === "price") {
            const direction = order === 'asc' ? 1 : -1
            results = [...results].sort((a, b) => {
                const priceA = a.product_info?.price;
                const priceB = b.product_info?.price;

                if (priceA == null && priceB == null) return 0;
                if (priceA == null) return 1;
                if (priceB == null) return -1;

                return direction * (priceA - priceB);
            })
        }
        return results;
    }

    // product_info is null when the downstream service fails for that product - could have introduced something more
    // complex but kept it simple
    private async processProductInfo(products: Product[]) {
        return await Promise.all(
            products.map(async (product) => {
                try {
                    const enrichment = await this.productInfoProvider.getProductInfo(product.id);

                    return {
                        ...product,
                        product_info: enrichment,
                    };
                } catch {
                    return {
                        ...product,
                        product_info: null,
                    };
                }
            }),
        );
    }

}



// export async function processProductInfo(
//     products: Product[],
//     productInfoProvider: ProductInfoProvider = new ProductInfoProvider(),
// ): Promise<ProductWithInfo[]> {
//     return await Promise.all(
//         products.map(async (product) => {
//             try {
//                 const enrichment = await productInfoProvider.getProductInfo(product.id);

//                 return {
//                     ...product,
//                     product_info: enrichment,
//                 };
//             } catch {
//                 return {
//                     ...product,
//                     product_info: null,
//                 };
//             }
//         }),
//     );

// }
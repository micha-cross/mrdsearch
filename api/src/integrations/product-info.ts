import { ProductInfo } from "../types.ts";
import productInfo from '../data/product-info.json' with { type: 'json' }

/** Simulated downstream latency range, in milliseconds */
const MIN_LATENCY_MS = 100
const MAX_LATENCY_MS = 800
/** Chance (0 to 1) that a downstream call fails */
const FAILURE_RATE = 0.1

/** Where price and availability come from. DownstreamProvider is the real one; tests pass a fake */
export interface DownstreamProvider {
    getProductInfo(id: number): Promise<ProductInfo>
}

export class ProductInfoProvider implements DownstreamProvider {

    public getProductInfo(id: number): Promise<ProductInfo> {
        const latency = MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < FAILURE_RATE) {
                    reject(new Error(`Downstream product service failed for product ${id}`))
                    return
                }

                const theInfo = productInfo.find((info) => info.id === id)
                if (!theInfo) {
                    reject(new Error(`No price or availability found for product ${id}`))
                    return
                }

                resolve(theInfo)
            }, latency)
        })
    }

}

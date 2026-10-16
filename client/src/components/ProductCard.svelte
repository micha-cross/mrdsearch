<script lang="ts">
  import type { Product } from '../types'

  let { product }: { product: Product } = $props()

  const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<article
  class="flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
>
  <span
    class="w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium tracking-wide text-slate-600 uppercase"
  >
    {product.category}
  </span>
  <h2 class="text-lg font-semibold text-slate-900">{product.name}</h2>
  <div class="mt-auto flex items-center justify-between">
    {#if !product.product_info}
      <span class="text-sm font-medium text-slate-400">Price unavailable</span>
    {:else if !product.product_info.available}
      <span class="rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-semibold text-red-600">Sold out</span>
    {:else}
      <span class="text-lg font-bold text-slate-900">{priceFormat.format(product.product_info.price)}</span>
    {/if}
    <span class="flex items-center gap-1 text-sm text-slate-600" title="Rating out of 5">
      <span class="text-amber-500" aria-hidden="true">★</span>
      {product.rating.toFixed(1)}
    </span>
  </div>
</article>

<script lang="ts">
  import { onMount } from 'svelte'
  import MultiSelect from './components/MultiSelect.svelte'
  import ProductCard from './components/ProductCard.svelte'
  import SortOrderToggle from './components/SortOrderToggle.svelte'
  import Spinner from './components/Spinner.svelte'
  import TextField from './components/TextField.svelte'
  import ToggleButton from './components/ToggleButton.svelte'
  import { readSearchParams, writeSearchParams } from './lib/searchParams'
  import type { Product, ProductRequest, ProductSort, SortOrder } from './types'

  const SEARCH_DEBOUNCE_MS = 250

  // Initial search state comes from the URL so a shared or saved link restores it
  const initial = readSearchParams()

  let query = $state(initial.query)
  let categories = $state<string[]>([])
  let selectedCategories = $state<string[]>(initial.categories)
  // The API sorts by one field at a time, so the sort toggles are mutually exclusive
  let sort = $state<{ field: ProductSort; order: SortOrder } | null>(initial.sort)
  let products = $state<Product[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  async function fetchCategories(): Promise<string[]> {
    const res = await fetch('/api/products/categories')
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`)
    return data
  }

  async function searchProducts(request: ProductRequest, signal: AbortSignal): Promise<Product[]> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`)
    return data
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  let searchController: AbortController | undefined

  // Debounced; cancels any pending timer and in-flight request so a stale
  // response never overwrites a newer one. Reads the current filters when the
  // timer fires, so callers don't need to pass them in
  function search() {
    clearTimeout(searchTimer)
    searchController?.abort()
    const controller = new AbortController()
    searchController = controller
    loading = true

    searchTimer = setTimeout(async () => {
      writeSearchParams({ query, categories: selectedCategories, sort })
      try {
        products = await searchProducts(
          { query, category: selectedCategories, sort: sort?.field, order: sort?.order },
          controller.signal,
        )
        error = null
      } catch (err) {
        if (controller.signal.aborted) return
        error = err instanceof Error ? err.message : 'Something went wrong'
        products = []
      }
      loading = false
    }, SEARCH_DEBOUNCE_MS)
  }

  function setSort(next: typeof sort) {
    sort = next
    search()
  }

  onMount(() => {

    fetchCategories()
      .then((result) => (categories = result))
      .catch(() => (categories = []))

    search()

    return () => {
      clearTimeout(searchTimer)
      searchController?.abort()
    }
  })
</script>

<main class="mx-auto flex h-screen max-w-2xl flex-col gap-4 p-6">
  <h1 class="text-center text-4xl font-bold tracking-tight text-slate-900">mrdsearch</h1>
  <TextField
    bind:value={query}
    label="Search food products"
    placeholder="e.g. apple, cheese, pasta"
    type="search"
    oninput={() => search()}
  />
  <MultiSelect
    bind:selected={selectedCategories}
    options={categories.map((category) => ({ label: category, value: category }))}
    label="Categories"
    placeholder="All categories"
    onchange={() => search()}
  />
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium text-slate-700">Sort by</span>
    <ToggleButton
      pressed={sort?.field === 'rating'}
      onclick={() => setSort(sort?.field === 'rating' ? null : { field: 'rating', order: 'desc' })}
    >
      Popular
    </ToggleButton>
    <SortOrderToggle
      label="Price"
      order={sort?.field === 'price' ? sort.order : null}
      onchange={(order) => setSort(order ? { field: 'price', order } : null)}
    />
  </div>

  <!-- The wrapper holds the spinner overlay so it stays put while the list scrolls -->
  <div class="relative min-h-0 flex-1">
    <section class="h-full overflow-y-auto rounded-xl bg-slate-50 p-3" aria-busy={loading}>
      {#if error}
        <p class="p-4 text-center text-red-600">Couldn't load products: {error}</p>
      {:else if products.length === 0}
        {#if !loading}
          <p class="p-4 text-center text-slate-500">No products match your search.</p>
        {/if}
      {:else}
        <ul class={['flex flex-col gap-3 transition-opacity', loading && 'opacity-50']}>
          {#each products as product (product.id)}
            <li><ProductCard {product} /></li>
          {/each}
        </ul>
      {/if}
    </section>

    {#if loading}
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Spinner size="lg" label="Loading products…" class="rounded-full p-2" />
      </div>
    {/if}
  </div>

  <!-- <p class="text-sm">
    API:
    <span
      class={{
        'font-medium': true,
        'text-slate-400': status === 'checking',
        'text-green-600': status === 'ok',
        'text-red-600': status === 'down',
      }}>{status}</span
    >
  </p> -->
</main>

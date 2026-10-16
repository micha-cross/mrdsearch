import type { ProductSort, SortOrder } from '../types'

export interface SearchState {
  query: string
  categories: string[]
  sort: { field: ProductSort; order: SortOrder } | null
}

const SORT_FIELDS: readonly ProductSort[] = ['rating', 'price']
const SORT_ORDERS: readonly SortOrder[] = ['asc', 'desc']

export function readSearchParams(search = window.location.search): SearchState {
  const params = new URLSearchParams(search)
  const field = params.get('sort') as ProductSort | null
  const order = params.get('order') as SortOrder | null

  return {
    query: params.get('q') ?? '',
    categories: params.getAll('category').filter(Boolean),
    sort:
      field && SORT_FIELDS.includes(field)
        ? { field, order: order && SORT_ORDERS.includes(order) ? order : 'desc' }
        : null,
  }
}

/** Could have maybe been simpler with a router but kept it lightweight as there is just one page for this task */
export function writeSearchParams(state: SearchState) {
  const params = new URLSearchParams()
  const query = state.query.trim()
  if (query) params.set('q', query)
  for (const category of state.categories) params.append('category', category)
  if (state.sort) {
    params.set('sort', state.sort.field)
    params.set('order', state.sort.order)
  }

  const currentSearch = window.location.search
  const currentHash = window.location.hash // if routing is added later
  const currentPath = window.location.pathname
  console.log(currentSearch)

  const search = params.toString()
  const url = `${currentPath}${search ? `?${search}` : ''}${currentHash}`
  if (url !== `${currentPath}${currentSearch}${currentHash}`) {
    history.replaceState(history.state, '', url)
  }
}

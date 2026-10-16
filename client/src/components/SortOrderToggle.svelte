<script lang="ts">
  import type { SortOrder } from '../types'
  import ToggleButton from './ToggleButton.svelte'

  interface Props {
    label: string
    /** null means this sort is off */
    order: SortOrder | null
    onchange: (order: SortOrder | null) => void
  }

  let { label, order, onchange }: Props = $props()

  // Each click cycles off → desc → asc → off
  const next: Record<SortOrder | 'off', SortOrder | null> = { off: 'desc', desc: 'asc', asc: null }

  const description = $derived(
    order === 'desc' ? 'high to low' : order === 'asc' ? 'low to high' : 'not sorted',
  )
</script>

<ToggleButton
  pressed={order !== null}
  onclick={() => onchange(next[order ?? 'off'])}
  aria-label="Sort by {label.toLowerCase()}, {description}"
>
  {label}
  <svg
    class="size-4"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    {#if order === 'asc'}
      <path d="M8 13V3M4 7l4-4 4 4" />
    {:else if order === 'desc'}
      <path d="M8 3v10M4 9l4 4 4-4" />
    {:else}
      <path d="M5 2v12M2 5l3-3 3 3M11 14V2M8 11l3 3 3-3" opacity="0.5" />
    {/if}
  </svg>
</ToggleButton>

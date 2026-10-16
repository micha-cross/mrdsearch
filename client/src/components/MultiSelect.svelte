<script lang="ts" module>
  export interface MultiSelectOption<V> {
    label: string
    value: V
  }
</script>

<script lang="ts" generics="T">
  interface Props {
    options: MultiSelectOption<T>[]
    selected?: T[]
    label?: string
    placeholder?: string
    disabled?: boolean
    onchange?: (selected: T[]) => void
  }

  let {
    options,
    selected = $bindable([]),
    label,
    placeholder = 'Select…',
    disabled = false,
    onchange,
  }: Props = $props()

  const id = crypto.randomUUID()
  let open = $state(false)
  let container: HTMLDivElement

  const summary = $derived.by(() => {
    const labels = options.filter((o) => selected.includes(o.value)).map((o) => o.label)
    if (labels.length === 0) return placeholder
    if (labels.length <= 2) return labels.join(', ')
    return `${labels.length} selected`
  })

  function update(next: T[]) {
    selected = next
    onchange?.(next)
  }

  function toggle(value: T) {
    update(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  function handleWindowPointerDown(event: PointerEvent) {
    if (open && !container.contains(event.target as Node)) open = false
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      open = false
      container.querySelector('button')?.focus()
    }
  }
</script>

<svelte:window onpointerdown={handleWindowPointerDown} />

<div class="relative flex w-full flex-col gap-1.5" bind:this={container} onkeydown={handleKeydown} role="none">
  {#if label}
    <span id="{id}-label" class="text-sm font-medium text-slate-700">{label}</span>
  {/if}
  <button
    type="button"
    {disabled}
    aria-haspopup="true"
    aria-expanded={open}
    aria-controls="{id}-list"
    aria-labelledby={label ? `${id}-label` : undefined}
    onclick={() => (open = !open)}
    class="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
  >
    <span class={['truncate', selected.length === 0 ? 'text-slate-400' : 'text-slate-900']}>{summary}</span>
    <span class={['ml-2 text-slate-500 transition-transform', open && 'rotate-180']} aria-hidden="true">▾</span>
  </button>

  {#if open}
    <div
      id="{id}-list"
      role="group"
      aria-labelledby={label ? `${id}-label` : undefined}
      class="absolute top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      {#each options as option (option.value)}
        <label
          class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          <input
            type="checkbox"
            class="size-4 accent-slate-700"
            checked={selected.includes(option.value)}
            onchange={() => toggle(option.value)}
          />
          {option.label}
        </label>
      {:else}
        <p class="px-3 py-2 text-sm text-slate-400">No options</p>
      {/each}
      {#if selected.length > 0}
        <button
          type="button"
          class="w-full border-t border-slate-100 px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50"
          onclick={() => update([])}
        >
          Clear selection
        </button>
      {/if}
    </div>
  {/if}
</div>

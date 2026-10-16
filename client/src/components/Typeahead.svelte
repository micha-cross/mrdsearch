<script lang="ts">
  import TextField from './TextField.svelte'

  interface Props {
    value?: string
    /** Already filtered and ordered by the caller; the component only displays them */
    suggestions: string[]
    label?: string
    placeholder?: string
    type?: 'text' | 'search'
    oninput?: (value: string) => void
    onselect?: (suggestion: string) => void
  }

  let {
    value = $bindable(''),
    suggestions,
    label,
    placeholder,
    type = 'search',
    oninput,
    onselect,
  }: Props = $props()

  const id = crypto.randomUUID()
  const listId = `${id}-suggestions`
  const optionId = (index: number) => `${id}-option-${index}`

  let open = $state(false)
  let activeIndex = $state(-1)

  // Nothing to suggest when the only match is exactly what's already typed
  const visible = $derived(
    open &&
      suggestions.length > 0 &&
      !(suggestions.length === 1 && suggestions[0].toLowerCase() === value.trim().toLowerCase()),
  )
  // The list can shrink under the highlight as new results arrive
  const active = $derived(activeIndex < suggestions.length ? activeIndex : -1)

  function choose(suggestion: string) {
    value = suggestion
    open = false
    activeIndex = -1
    onselect?.(suggestion)
  }

  function move(step: number) {
    open = true
    const count = suggestions.length
    if (count === 0) return
    activeIndex = active === -1 ? (step > 0 ? 0 : count - 1) : (active + step + count) % count
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'Enter' && visible && active !== -1) {
      event.preventDefault()
      choose(suggestions[active])
    } else if (event.key === 'Escape' && visible) {
      // Stops a search input from also clearing itself
      event.preventDefault()
      open = false
      activeIndex = -1
    }
  }
</script>

<div class="relative w-full">
  <TextField
    {id}
    bind:value
    {label}
    {placeholder}
    {type}
    autocomplete="off"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={visible}
    aria-controls={listId}
    aria-activedescendant={visible && active !== -1 ? optionId(active) : undefined}
    oninput={(event) => {
      open = true
      activeIndex = -1
      oninput?.(event.currentTarget.value)
    }}
    onkeydown={handleKeydown}
    onblur={() => (open = false)}
  />

  {#if visible}
    <ul
      id={listId}
      role="listbox"
      aria-label={label ? `${label} suggestions` : 'Suggestions'}
      class="absolute top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      {#each suggestions as suggestion, index (suggestion)}
        <!-- Keyboard selection is handled on the input (combobox pattern), so options only need mouse handlers -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          id={optionId(index)}
          role="option"
          aria-selected={index === active}
          class={[
            'cursor-pointer px-3 py-2 text-sm text-slate-800',
            index === active ? 'bg-slate-100' : 'hover:bg-slate-50',
          ]}
          onpointerdown={(event) => event.preventDefault()}
          onclick={() => choose(suggestion)}
          onpointerenter={() => (activeIndex = index)}
        >
          {suggestion}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLButtonAttributes, 'type'> {
    pressed: boolean
    children: Snippet
  }

  let { pressed, children, class: className = '', ...rest }: Props = $props()
</script>

<button
  type="button"
  aria-pressed={pressed}
  class={[
    'inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition',
    'focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    pressed
      ? 'border-slate-800 bg-slate-800 text-white hover:bg-slate-700'
      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    className,
  ]}
  {...rest}
>
  {@render children()}
</button>

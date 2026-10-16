<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLInputAttributes, 'value' | 'type'> {
    value?: string
    label?: string
    type?: 'text' | 'search' | 'email' | 'password' | 'url' | 'tel'
  }

  let {
    value = $bindable(''),
    label,
    type = 'text',
    id = crypto.randomUUID(),
    class: className = '',
    ...rest
  }: Props = $props()
</script>

<div class="flex w-full flex-col gap-1.5">
  {#if label}
    <label for={id} class="text-sm font-medium text-slate-700">{label}</label>
  {/if}
  <input
    {id}
    {type}
    bind:value
    class={[
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm',
      'placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none',
      'disabled:cursor-not-allowed disabled:bg-slate-100',
      className,
    ]}
    {...rest}
  />
</div>

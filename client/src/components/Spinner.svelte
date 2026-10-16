<script lang="ts">
  interface Props {
    /** Announced to screen readers */
    label?: string
    size?: 'sm' | 'md' | 'lg'
    class?: string
  }

  let { label = 'Loading…', size = 'md', class: className = '' }: Props = $props()

  const sizes = { sm: 'size-4 border-2', md: 'size-8 border-[3px]', lg: 'size-12 border-4' }
</script>

<div role="status" class={['inline-flex', className]}>
  <span
    class={['animate-spin rounded-full border-slate-200 border-t-slate-700', sizes[size]]}
    aria-hidden="true"
  ></span>
  <span class="sr-only">{label}</span>
</div>

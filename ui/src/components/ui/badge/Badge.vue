<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiBadge' })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
    class?: string
  }>(),
  {
    variant: 'default',
    class: '',
  },
)

const classes = computed(() =>
  cn(
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors',
    {
      'border-transparent bg-primary text-primary-foreground': props.variant === 'default',
      'border-transparent bg-secondary text-secondary-foreground': props.variant === 'secondary',
      'border-border text-foreground': props.variant === 'outline',
      'border-transparent bg-destructive text-destructive-foreground':
        props.variant === 'destructive',
      'border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300':
        props.variant === 'success',
      'border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300':
        props.variant === 'warning',
    },
    props.class,
  ),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

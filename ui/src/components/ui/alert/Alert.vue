<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiAlert' })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'warning'
    class?: string
  }>(),
  {
    variant: 'default',
    class: '',
  },
)

const classes = computed(() =>
  cn(
    'relative w-full rounded-lg border px-4 py-3 text-sm',
    {
      'border-border bg-card text-card-foreground': props.variant === 'default',
      'border-destructive/35 bg-destructive/5 text-destructive': props.variant === 'destructive',
      'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200':
        props.variant === 'warning',
    },
    props.class,
  ),
)
</script>

<template>
  <div :class="classes" role="alert">
    <slot />
  </div>
</template>

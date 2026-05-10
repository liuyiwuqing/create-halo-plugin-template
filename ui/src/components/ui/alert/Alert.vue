<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiAlert',
})

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'warning'
  }>(),
  {
    variant: 'default',
  },
)

const classes = computed(() =>
  cn('relative w-full rounded-lg border p-4 text-sm', {
    'bg-background text-foreground': props.variant === 'default',
    'border-destructive/50 text-destructive dark:border-destructive': props.variant === 'destructive',
    'border-amber-500/40 text-amber-700 dark:text-amber-300': props.variant === 'warning',
  }),
)
</script>

<template>
  <div role="alert" :class="classes">
    <slot />
  </div>
</template>

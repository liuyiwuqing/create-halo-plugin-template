<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiBadge',
})

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
  }>(),
  {
    variant: 'default',
  },
)

const classes = computed(() =>
  cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
      'border-transparent bg-primary text-primary-foreground': props.variant === 'default',
      'border-transparent bg-secondary text-secondary-foreground': props.variant === 'secondary',
      'text-foreground': props.variant === 'outline',
      'border-transparent bg-destructive text-destructive-foreground':
        props.variant === 'destructive',
      'border-transparent bg-emerald-500 text-white': props.variant === 'success',
      'border-transparent bg-amber-500 text-white': props.variant === 'warning',
    },
  ),
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

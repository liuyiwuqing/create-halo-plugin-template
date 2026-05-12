<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTableHead' })

const props = withDefaults(
  defineProps<{
    class?: string
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    class: '',
    align: 'left',
  },
)

const classes = computed(() =>
  cn(
    'h-10 px-3 text-xs font-semibold text-muted-foreground',
    {
      'text-left': props.align === 'left',
      'text-center': props.align === 'center',
      'text-right': props.align === 'right',
    },
    props.class,
  ),
)
</script>

<template>
  <th :class="classes">
    <slot />
  </th>
</template>

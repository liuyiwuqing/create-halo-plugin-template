<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTableCell' })

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
    'p-3 align-middle text-sm text-foreground',
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
  <td :class="classes">
    <slot />
  </td>
</template>

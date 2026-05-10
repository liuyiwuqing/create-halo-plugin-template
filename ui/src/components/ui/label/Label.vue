<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiLabel',
})

defineProps<{
  class?: string
}>()
</script>

<template>
  <label :class="cn('text-sm font-medium leading-none', $props.class)">
    <slot />
  </label>
</template>

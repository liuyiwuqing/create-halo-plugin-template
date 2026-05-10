<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiSkeleton',
})

defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="cn('animate-pulse rounded-md bg-primary/10', $props.class)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  label: string
  tone?: string
}>()

const variant = computed(() => {
  switch (props.tone) {
    case 'success':
    case 'done':
    case 'auto':
      return 'success'
    case 'warning':
    case 'recommended':
    case 'todo':
      return 'warning'
    case 'danger':
      return 'destructive'
    case 'primary':
    case 'now':
      return 'default'
    default:
      return 'secondary'
  }
})
</script>

<template>
  <Badge :variant="variant">
    {{ label }}
  </Badge>
</template>

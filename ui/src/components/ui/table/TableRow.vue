<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTableRow' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() =>
  cn('border-b border-border transition-colors hover:bg-muted/45', props.class),
)
</script>

<template>
  <tr :class="classes">
    <slot />
  </tr>
</template>

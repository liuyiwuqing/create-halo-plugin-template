<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiCard' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() =>
  cn('rounded-lg border border-border bg-card text-card-foreground shadow-xs', props.class),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

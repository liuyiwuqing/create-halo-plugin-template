<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiCardHeader' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('grid gap-1.5 p-6', props.class))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

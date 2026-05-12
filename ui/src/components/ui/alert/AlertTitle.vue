<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiAlertTitle' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('mb-1 font-medium leading-none tracking-tight', props.class))
</script>

<template>
  <h5 :class="classes">
    <slot />
  </h5>
</template>

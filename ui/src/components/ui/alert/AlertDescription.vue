<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiAlertDescription' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('text-sm leading-relaxed [&_p]:leading-relaxed', props.class))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

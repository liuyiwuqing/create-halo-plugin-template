<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiCardContent' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('px-6', props.class))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

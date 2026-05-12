<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTableHeader' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('[&_tr]:border-b', props.class))
</script>

<template>
  <thead :class="classes">
    <slot />
  </thead>
</template>

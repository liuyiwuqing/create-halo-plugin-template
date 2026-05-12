<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDialogHeader' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('flex flex-col gap-2 text-left', props.class))
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

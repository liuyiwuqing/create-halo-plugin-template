<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDialogFooter' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() =>
  cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.class),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

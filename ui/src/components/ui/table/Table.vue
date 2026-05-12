<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTable' })

const props = withDefaults(defineProps<{ class?: string }>(), { class: '' })
const classes = computed(() => cn('w-full caption-bottom text-sm', props.class))
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="classes">
      <slot />
    </table>
  </div>
</template>

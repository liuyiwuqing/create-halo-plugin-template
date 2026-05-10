<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({
  name: 'UiSelect',
})

defineProps<{
  class?: string
  modelValue?: string | boolean | number
}>()

defineEmits<{
  (event: 'update:modelValue', value: string | boolean | number): void
}>()
</script>

<template>
  <select
    :value="String(modelValue ?? '')"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        $props.class,
      )
    "
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>

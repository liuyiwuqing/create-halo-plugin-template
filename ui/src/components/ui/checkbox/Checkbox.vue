<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Check, Minus } from 'lucide-vue-next'

defineOptions({
  name: 'UiCheckbox',
})

defineProps<{
  class?: string
  modelValue?: boolean
  indeterminate?: boolean
}>()

defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : modelValue"
    :class="
      cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        (modelValue || indeterminate) && 'bg-primary text-primary-foreground',
        $props.class,
      )
    "
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span v-if="modelValue && !indeterminate" class="flex items-center justify-center text-current">
      <Check class="size-3.5" />
    </span>
    <span v-else-if="indeterminate" class="flex items-center justify-center text-current">
      <Minus class="size-3.5" />
    </span>
  </button>
</template>

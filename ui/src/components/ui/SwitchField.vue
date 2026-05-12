<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(
  defineProps<{
    modelValue: boolean
    label: string
    help?: string
    error?: string
    disabled?: boolean
    activeText?: string
    inactiveText?: string
  }>(),
  {
    help: '',
    error: '',
    disabled: false,
    activeText: '',
    inactiveText: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <label class="field-control field-control--inline" :class="{ 'field-control--error': error }">
    <span class="field-control__copy">
      <span class="field-control__label">{{ label }}</span>
      <span v-if="error || help" class="field-control__message">{{ error || help }}</span>
    </span>
    <button
      type="button"
      :disabled="disabled"
      role="switch"
      :aria-checked="modelValue"
      :class="
        cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          modelValue ? 'bg-primary' : 'bg-muted-foreground/25',
        )
      "
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        :class="
          cn(
            'pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-transform',
            modelValue ? 'translate-x-5' : 'translate-x-0',
          )
        "
      />
      <span v-if="activeText || inactiveText" class="sr-only">
        {{ modelValue ? activeText : inactiveText }}
      </span>
    </button>
  </label>
</template>

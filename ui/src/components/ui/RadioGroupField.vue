<script setup lang="ts">
import type { SelectOption } from '@/types/ui'
import { cn } from '@/lib/utils'

type RadioValue = string | number | boolean

withDefaults(
  defineProps<{
    modelValue?: RadioValue
    label: string
    options: SelectOption[]
    help?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    help: '',
    error: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: RadioValue): void
}>()
</script>

<template>
  <label class="field-control" :class="{ 'field-control--error': error }">
    <span class="field-control__label">{{ label }}</span>
    <div class="inline-flex rounded-lg bg-muted p-1">
      <button
        v-for="option in options"
        :key="`${option.value}`"
        type="button"
        :disabled="disabled || option.disabled"
        :class="
          cn(
            'inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-50',
            modelValue === option.value && 'bg-background text-foreground shadow-xs',
          )
        "
        @click="emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <span v-if="error || help" class="field-control__message">{{ error || help }}</span>
  </label>
</template>

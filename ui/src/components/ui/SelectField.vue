<script setup lang="ts">
import type { SelectOption } from '@/types/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectValue = string | number | Array<string | number>

withDefaults(
  defineProps<{
    modelValue?: SelectValue
    label: string
    options: SelectOption[]
    placeholder?: string
    help?: string
    error?: string
    disabled?: boolean
    multiple?: boolean
    clearable?: boolean
    compact?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '请选择',
    help: '',
    error: '',
    disabled: false,
    multiple: false,
    clearable: true,
    compact: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectValue | undefined): void
}>()
</script>

<template>
  <label
    class="field-control"
    :class="{ 'field-control--error': error, 'field-control--compact': compact }"
  >
    <span class="field-control__label">{{ label }}</span>
    <Select
      class="field-control__input"
      :model-value="modelValue"
      :disabled="disabled"
      :multiple="multiple"
      @update:model-value="emit('update:modelValue', $event as SelectValue | undefined)"
    >
      <SelectTrigger>
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="`${option.value}`"
          :value="option.value"
          :disabled="option.disabled || (!clearable && option.value === '')"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <span v-if="error || help" class="field-control__message">{{ error || help }}</span>
  </label>
</template>

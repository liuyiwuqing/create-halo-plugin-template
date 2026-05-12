<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: [string, string]
    label: string
    startPlaceholder?: string
    endPlaceholder?: string
    help?: string
    error?: string
    disabled?: boolean
    valueFormat?: string
  }>(),
  {
    modelValue: undefined,
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    help: '',
    error: '',
    disabled: false,
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: [string, string] | undefined): void
}>()

const startValue = computed(() => props.modelValue?.[0]?.replace(' ', 'T').slice(0, 16) || '')
const endValue = computed(() => props.modelValue?.[1]?.replace(' ', 'T').slice(0, 16) || '')

const formatValue = (value: string) => {
  if (!value) {
    return ''
  }
  if (props.valueFormat === 'YYYY-MM-DD HH:mm:ss') {
    return `${value.replace('T', ' ')}:00`
  }
  return value
}

const updateValue = (index: 0 | 1, value: string) => {
  const next: [string, string] = [startValue.value, endValue.value]
  next[index] = formatValue(value)
  emit('update:modelValue', next[0] || next[1] ? next : undefined)
}
</script>

<template>
  <label class="field-control" :class="{ 'field-control--error': error }">
    <span class="field-control__label">{{ label }}</span>
    <div class="field-control__range">
      <input
        class="field-control__input"
        :value="startValue"
        type="datetime-local"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        @input="updateValue(0, ($event.target as HTMLInputElement).value)"
      />
      <input
        class="field-control__input"
        :value="endValue"
        type="datetime-local"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        @input="updateValue(1, ($event.target as HTMLInputElement).value)"
      />
    </div>
    <span v-if="error || help" class="field-control__message">{{ error || help }}</span>
  </label>
</template>

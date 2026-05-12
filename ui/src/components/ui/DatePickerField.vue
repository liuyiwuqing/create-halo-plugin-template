<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label: string
    placeholder?: string
    help?: string
    error?: string
    disabled?: boolean
    valueFormat?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请选择时间',
    help: '',
    error: '',
    disabled: false,
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | undefined): void
}>()

const inputValue = computed(() => {
  if (!props.modelValue) {
    return ''
  }
  return props.modelValue.replace(' ', 'T').slice(0, 16)
})

const formatValue = (value: string) => {
  if (!value) {
    return undefined
  }
  if (props.valueFormat === 'YYYY-MM-DD HH:mm:ss') {
    return `${value.replace('T', ' ')}:00`
  }
  return value
}
</script>

<template>
  <label class="field-control" :class="{ 'field-control--error': error }">
    <span class="field-control__label">{{ label }}</span>
    <input
      class="field-control__input"
      :value="inputValue"
      type="datetime-local"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', formatValue(($event.target as HTMLInputElement).value))"
    />
    <span v-if="error || help" class="field-control__message">{{ error || help }}</span>
  </label>
</template>

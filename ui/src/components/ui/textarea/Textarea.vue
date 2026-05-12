<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTextarea', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    class?: string
  }>(),
  {
    modelValue: '',
    class: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const attrs = useAttrs()
const classes = computed(() =>
  cn(
    'flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <textarea
    v-bind="attrs"
    :value="modelValue"
    :class="classes"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

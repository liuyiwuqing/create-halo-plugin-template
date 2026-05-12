<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui'
import { ChevronDown } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiSelectTrigger' })

const props = withDefaults(
  defineProps<SelectTriggerProps & { class?: string }>(),
  {
    class: '',
  },
)
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <SelectTrigger
    v-bind="delegatedProps"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-nowrap text-foreground shadow-xs outline-none transition-[border-color,box-shadow] data-[placeholder]:text-muted-foreground focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="size-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>

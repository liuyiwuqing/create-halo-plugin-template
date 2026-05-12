<script setup lang="ts">
import type { SelectItemProps } from 'reka-ui'
import { Check } from 'lucide-vue-next'
import { SelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiSelectItem' })

const props = withDefaults(
  defineProps<SelectItemProps & { class?: string }>(),
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
  <SelectItem
    v-bind="delegatedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check class="size-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>

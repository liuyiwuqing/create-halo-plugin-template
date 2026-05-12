<script setup lang="ts">
import type { DropdownMenuItemProps } from 'reka-ui'
import { DropdownMenuItem } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDropdownMenuItem' })

const props = withDefaults(defineProps<DropdownMenuItemProps & { class?: string }>(), {
  class: '',
})
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <DropdownMenuItem
    v-bind="delegatedProps"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>

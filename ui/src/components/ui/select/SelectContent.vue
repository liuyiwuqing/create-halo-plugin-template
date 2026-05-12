<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from 'reka-ui'
import {
  SelectContent,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiSelectContent' })

const props = withDefaults(
  defineProps<SelectContentProps & { class?: string }>(),
  {
    position: 'popper',
    class: '',
  },
)
const emits = defineEmits<SelectContentEmits>()
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="forwarded"
      :class="
        cn(
          'halo-plugin-template-floating-surface relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          props.class,
        )
      "
    >
      <SelectViewport
        :class="
          cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--reka-select-trigger-height)] w-full min-w-[var(--reka-select-trigger-width)]',
          )
        "
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>

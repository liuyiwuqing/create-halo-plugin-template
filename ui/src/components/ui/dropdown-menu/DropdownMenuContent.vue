<script setup lang="ts">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDropdownMenuContent' })

const props = withDefaults(
  defineProps<DropdownMenuContentProps & { class?: string }>(),
  {
    sideOffset: 4,
    class: '',
  },
)
const emits = defineEmits<DropdownMenuContentEmits>()
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="forwarded"
      :class="
        cn(
          'halo-plugin-template-floating-surface z-[2102] min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          props.class,
        )
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>

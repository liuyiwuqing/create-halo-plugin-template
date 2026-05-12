<script setup lang="ts">
import type { DialogTitleProps } from 'reka-ui'
import { DialogTitle } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDialogTitle' })

const props = withDefaults(defineProps<DialogTitleProps & { class?: string }>(), {
  class: '',
})
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <DialogTitle
    v-bind="delegatedProps"
    :class="cn('text-lg leading-none font-semibold tracking-tight', props.class)"
  >
    <slot />
  </DialogTitle>
</template>

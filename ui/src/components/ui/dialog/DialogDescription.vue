<script setup lang="ts">
import type { DialogDescriptionProps } from 'reka-ui'
import { DialogDescription } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiDialogDescription' })

const props = withDefaults(defineProps<DialogDescriptionProps & { class?: string }>(), {
  class: '',
})
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <DialogDescription
    v-bind="delegatedProps"
    :class="cn('text-sm leading-relaxed text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>

<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui'
import { TabsContent } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsContent' })

const props = withDefaults(defineProps<TabsContentProps & { class?: string }>(), { class: '' })
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <TabsContent
    v-bind="delegatedProps"
    :class="cn('mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring', props.class)"
  >
    <slot />
  </TabsContent>
</template>

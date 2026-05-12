<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui'
import { TabsTrigger } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsTrigger' })

const props = withDefaults(defineProps<TabsTriggerProps & { class?: string }>(), { class: '' })
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <TabsTrigger
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

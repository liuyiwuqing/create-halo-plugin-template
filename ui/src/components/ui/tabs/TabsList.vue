<script setup lang="ts">
import type { TabsListProps } from 'reka-ui'
import { TabsList } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiTabsList' })

const props = withDefaults(defineProps<TabsListProps & { class?: string }>(), { class: '' })
const delegatedProps = computed(() => {
  const { class: omittedClass, ...delegated } = props
  void omittedClass
  return delegated
})
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>

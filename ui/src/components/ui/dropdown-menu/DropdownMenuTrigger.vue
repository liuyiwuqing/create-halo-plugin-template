<script setup lang="ts">
import type { DropdownMenuTriggerProps } from 'reka-ui'
import { DropdownMenuTrigger } from 'reka-ui'

defineOptions({ name: 'UiDropdownMenuTrigger' })

defineProps<DropdownMenuTriggerProps>()
</script>

<template>
  <DropdownMenuTrigger v-bind="$props">
    <slot />
  </DropdownMenuTrigger>
</template>

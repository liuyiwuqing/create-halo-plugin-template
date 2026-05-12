<script setup lang="ts">
import type { DialogTriggerProps } from 'reka-ui'
import { DialogTrigger } from 'reka-ui'

defineOptions({ name: 'UiDialogTrigger' })

defineProps<DialogTriggerProps>()
</script>

<template>
  <DialogTrigger v-bind="$props">
    <slot />
  </DialogTrigger>
</template>

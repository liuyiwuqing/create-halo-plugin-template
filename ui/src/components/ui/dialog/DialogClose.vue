<script setup lang="ts">
import type { DialogCloseProps } from 'reka-ui'
import { DialogClose } from 'reka-ui'

defineOptions({ name: 'UiDialogClose' })

defineProps<DialogCloseProps>()
</script>

<template>
  <DialogClose v-bind="$props">
    <slot />
  </DialogClose>
</template>

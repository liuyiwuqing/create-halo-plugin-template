<script setup lang="ts">
import { VLoading } from '@halo-dev/components'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

withDefaults(
  defineProps<{
    visible: boolean
    title: string
    width?: number
    loading?: boolean
    submitting?: boolean
    readonly?: boolean
    confirmText?: string
    cancelText?: string
  }>(),
  {
    width: 680,
    loading: false,
    submitting: false,
    readonly: false,
    confirmText: '保存',
    cancelText: '取消',
  },
)

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'confirm'): void
}>()

const close = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog :open="visible" @update:open="emit('update:visible', $event)">
    <DialogContent
      class="data-form-modal max-h-[88dvh] overflow-hidden p-0"
      :style="{ width: `min(${width}px, calc(100vw - 2rem))` }"
    >
      <DialogHeader class="border-b border-border px-5 py-4">
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>

      <div class="max-h-[calc(88dvh-122px)] overflow-y-auto px-5 py-4">
        <VLoading v-show="loading" />

        <div v-show="!loading" class="data-form-modal__body">
          <slot />
        </div>
      </div>

      <DialogFooter class="border-t border-border px-5 py-4">
        <slot name="footer">
          <Button variant="outline" @click="close">
            {{ readonly ? '关闭' : cancelText }}
          </Button>
          <Button
            v-show="!readonly"
            :disabled="submitting"
            @click="emit('confirm')"
          >
            {{ submitting ? '处理中' : confirmText }}
          </Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
